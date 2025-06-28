import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { supabase, db, generateDeviceId, UserProfile, AnonymousDevice } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

export interface UserData {
  // User identification
  id?: string;
  name: string;
  email?: string;
  profile_image_url?: string;
  
  // Personalization data
  country?: string;
  feeling?: string;
  
  // Authentication state
  isAuthenticated: boolean;
  
  // Plan and trial information
  currentPlan?: 'freemium' | 'monthly_trial' | 'yearly_trial' | 'monthly_premium' | 'yearly_premium';
  trialStartDate?: string;
  trialEndDate?: string;
  createdAt?: string;
  hasEverTrialed?: boolean;
  
  // Judge account status
  isJudge?: boolean;
  
  // Usage tracking
  dailyMessagesUsed?: number;
  voiceNotesUsed?: number;
  lastResetDate?: string;
  
  // Device tracking for anonymous users
  deviceId?: string;
  
  // Subscription status
  subscription_status: 'active' | 'trialing' | 'canceled' | 'incomplete' | 'past_due' | null;
  trial_ends_at: string | null;
}

export interface UserLimits {
  hasLimits: boolean;
  maxMessages: number;
  messagesUsed: number;
  messagesRemaining: number;
  maxVoiceNotes: number;
  voiceNotesUsed: number;
  voiceNotesRemaining: number;
  resetsOn: string;
}

export interface UserContextType {
  userData: UserData | null;
  supabaseUser: User | null;
  isLoading: boolean;
  setUserData: (data: UserData | null) => void;
  updateUserData: (updates: Partial<UserData>) => void;
  clearUserData: () => void;
  refreshUserData: () => Promise<void>;
  incrementMessageCount: () => Promise<void>;
  incrementVoiceNoteCount: () => Promise<void>;
  resetDailyLimits: () => Promise<void>;
  limits: UserLimits;
  recordMessage: () => void;
  recordVoiceNote: () => void;
  isPremiumUser: () => boolean;
  isFreemiumUser: () => boolean;
  isAnonymousUser: () => boolean;
  isActiveTrialUser: () => boolean;
  refreshUserDataAfterChat: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const today = new Date().toISOString().split('T')[0];

  // Initialize user data and auth state
  useEffect(() => {
    let mounted = true;
    setIsLoading(true);

    // Restore session from Supabase on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setSupabaseUser(session.user);
        loadAuthenticatedUser(session.user).finally(() => {
          if (mounted) setIsLoading(false);
        });
      } else {
        loadAnonymousUser().finally(() => {
          if (mounted) setIsLoading(false);
        });
      }
    }).catch((error) => {
      console.error('Error getting initial session:', error);
      if (mounted) setIsLoading(false);
    });

    // The onAuthStateChange listener will handle all auth events.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN') {
        try {
          if (session?.user) {
            setSupabaseUser(session.user);
            await loadAuthenticatedUser(session.user);
          } else {
            await loadAnonymousUser();
          }
        } catch (error) {
          console.error('Error in onAuthStateChange handler:', error);
        } finally {
          if (mounted) {
            setIsLoading(false);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        setSupabaseUser(null);
        setUserData(null);
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const loadAuthenticatedUser = async (user: User) => {
    let profile: UserProfile | null = null;
    try {
      profile = await db.profiles.get(user.id);
      
      if (!profile) {
        const name = user.user_metadata?.name || user.email?.split('@')[0] || 'User';
        try {
          profile = await db.profiles.create(user.id, user.email!, name);
        } catch (createError: unknown) {
          console.error('Failed to create profile:', createError);
          await supabase.auth.signOut();
          return; 
        }
      }
    } catch (error: unknown) {
      console.error('Error fetching/creating profile:', error);
      await supabase.auth.signOut();
      return;
    }

    if (!profile) {
      return;
    }

    // --- TRIAL EXPIRY LOGIC ---
    let currentPlan = profile.current_plan;
    let trialStartDate = profile.trial_start_date;
    let trialEndDate = profile.trial_end_date;
    const now = new Date();
    if ((currentPlan === 'monthly_trial' || currentPlan === 'yearly_trial') && trialEndDate) {
      const trialEnd = new Date(trialEndDate);
      if (now > trialEnd) {
        // Trial expired, revert to freemium
        currentPlan = 'freemium';
        trialStartDate = undefined;
        trialEndDate = undefined;
        // Update in DB
        await db.profiles.update(profile.id, {
          current_plan: 'freemium',
          trial_start_date: null,
          trial_end_date: null
        });
      }
    }
    // --- END TRIAL EXPIRY LOGIC ---

    const finalUserData = {
      id: profile.id,
      name: profile.name,
      email: profile.email ?? undefined,
      profile_image_url: profile.profile_image_url ?? undefined,
      isAuthenticated: true,
      currentPlan,
      trialStartDate: trialStartDate || undefined,
      trialEndDate: trialEndDate || undefined,
      createdAt: profile.created_at || undefined,
      hasEverTrialed: profile.has_ever_trialed ?? false,
      isJudge: profile.is_judge ?? false,
      dailyMessagesUsed: 0, // Reset for authenticated users daily
      voiceNotesUsed: 0,
      lastResetDate: new Date().toISOString().split('T')[0],
      subscription_status: profile.subscription_status ?? null,
      trial_ends_at: profile.trial_ends_at ?? null
    };

    setUserData(finalUserData);
  };

  const loadAnonymousUser = async () => {
    try {
      // Generate or retrieve a persistent UUID for this anonymous user
      let anonUuid = localStorage.getItem('amara_anon_uuid');
      if (!anonUuid) {
        anonUuid = crypto.randomUUID();
        localStorage.setItem('amara_anon_uuid', anonUuid);
      }
      
      const deviceId = generateDeviceId();
      let device: AnonymousDevice | null = null;
      let validDeviceId: string | undefined = undefined;

      // First, try to get existing device record
      try {
        device = await db.anonymousDevices.get(deviceId);
        if (device) {
          validDeviceId = device.device_id;
        }
      } catch (error) {
        // Device record not found, will create new one
      }

      // If device doesn't exist, create it
      if (!device) {
        try {
          device = await db.anonymousDevices.create(deviceId);
          if (device) {
            validDeviceId = device.device_id;
          }
        } catch (createError: unknown) {
          // If creation fails due to duplicate key, try to fetch again
          if (createError instanceof Error && createError.message.includes('23505')) {
            try {
              device = await db.anonymousDevices.get(deviceId);
              if (device) {
                validDeviceId = device.device_id;
              }
            } catch (fetchError) {
              // Fall back to creating a new device ID
              const newDeviceId = 'device_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
              localStorage.setItem('amara_device_id', newDeviceId);
              
              try {
                device = await db.anonymousDevices.create(newDeviceId);
                if (device) {
                  validDeviceId = device.device_id;
                }
              } catch (finalError) {
                console.error('Final device creation attempt failed:', finalError);
              }
            }
          } else {
            console.error('Non-duplicate key error during device creation:', createError);
          }
        }
      }

      // Check if we need to reset daily limits
      const today = new Date().toISOString().split('T')[0];
      if (device && device.last_active_date !== today) {
        try {
          device = await db.anonymousDevices.resetDailyLimits(deviceId);
          if (device) {
            validDeviceId = device.device_id;
          }
        } catch (resetError) {
          console.error('Failed to reset daily limits:', resetError);
          // Continue with existing device data if reset fails
          validDeviceId = device.device_id;
        }
      }

      // Set user data - always include deviceId (fallback to local if needed)
      const finalUserData = {
        id: anonUuid,
        name: localStorage.getItem('amaraUserName') || 'Anonymous User',
        isAuthenticated: false,
        currentPlan: 'freemium' as const,
        deviceId: validDeviceId || deviceId,
        dailyMessagesUsed: device?.messages_today || 0,
        voiceNotesUsed: typeof device?.voice_notes_used === 'number'
          ? device.voice_notes_used
          : 0,
        lastResetDate: device?.last_active_date || new Date().toISOString().split('T')[0],
        createdAt: device?.created_at || undefined,
        hasEverTrialed: false,
        isJudge: false,
        subscription_status: null,
        trial_ends_at: null
      };
      
      setUserData(finalUserData);
      
    } catch (error) {
      console.error('Failed to load anonymous user, using fallback:', error);
      
      // Fallback to basic anonymous user without database persistence
      const fallbackUserData = {
        id: localStorage.getItem('amara_anon_uuid') || crypto.randomUUID(),
        name: 'Anonymous User',
        isAuthenticated: false,
        currentPlan: 'freemium' as const,
        deviceId: localStorage.getItem('amara_device_id') || 'device_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now(),
        dailyMessagesUsed: 0,
        voiceNotesUsed: 0,
        lastResetDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        hasEverTrialed: false,
        isJudge: false,
        subscription_status: null,
        trial_ends_at: null
      };
      
      setUserData(fallbackUserData);
    }
  };

  const updateUserData = useCallback(async (updates: Partial<UserData>) => {
    if (!userData) return;

    const updatedData = { ...userData, ...updates };
    setUserData(updatedData);

    // Persist changes to Supabase
    try {
      if (userData.isAuthenticated && userData.id) {
        // Update authenticated user profile
        const profileUpdates: Partial<UserProfile> = {};
        if (updates.name) profileUpdates.name = updates.name;
        if (updates.profile_image_url) profileUpdates.profile_image_url = updates.profile_image_url;
        if (updates.currentPlan) profileUpdates.current_plan = updates.currentPlan;
        if (updates.trialStartDate) profileUpdates.trial_start_date = updates.trialStartDate;
        if (updates.trialEndDate) profileUpdates.trial_end_date = updates.trialEndDate;
        if (updates.hasEverTrialed !== undefined) profileUpdates.has_ever_trialed = updates.hasEverTrialed;
        if (updates.isJudge !== undefined) profileUpdates.is_judge = updates.isJudge;

        if (Object.keys(profileUpdates).length > 0) {
          await db.profiles.update(userData.id, profileUpdates);
        }
      } else if (userData.deviceId) {
        // Only attempt to update if we have a valid deviceId (meaning the record exists in the database)
        const deviceUpdates: Partial<AnonymousDevice> = {};
        if (updates.dailyMessagesUsed !== undefined) deviceUpdates.messages_today = updates.dailyMessagesUsed;
        if (updates.voiceNotesUsed !== undefined) deviceUpdates.voice_notes_used = updates.voiceNotesUsed > 0;
        if (updates.lastResetDate) deviceUpdates.last_active_date = updates.lastResetDate;

        if (Object.keys(deviceUpdates).length > 0) {
          try {
            await db.anonymousDevices.update(userData.deviceId, deviceUpdates);
          } catch (updateError: unknown) {
            // If the record doesn't exist or there's an RLS issue, remove deviceId from userData
            // This prevents future database update attempts and switches to local-only mode
            if (updateError instanceof Error && (updateError.message.includes('0 rows') || 
                updateError.message.includes('PGRST116') || 
                updateError.message.includes('42501'))) {
              setUserData(prev => prev ? { ...prev, deviceId: undefined } : null);
            }
          }
        }
      }
      // If no deviceId, we're in local-only mode and don't persist to database
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  }, [userData]);

  const clearUserData = () => {
    setUserData(null);
    setSupabaseUser(null);
  };

  const refreshUserData = useCallback(async () => {
    if (supabaseUser) {
      await loadAuthenticatedUser(supabaseUser);
    } else {
      await loadAnonymousUser();
    }
  }, [supabaseUser]);

  // New method to refresh user data after chat interactions
  const refreshUserDataAfterChat = useCallback(async () => {
    if (!userData) return;
    try {
      if (userData.isAuthenticated && userData.id) {
        // Refresh authenticated user data
        const profile = await db.profiles.get(userData.id);
        if (profile) {
          setUserData(prev => prev ? {
            ...prev,
            dailyMessagesUsed: profile.daily_messages_used || 0,
            voiceNotesUsed: profile.voice_notes_used || 0,
          } : null);
        }
      } else if (userData.deviceId) {
        // Refresh anonymous device data
        const device = await db.anonymousDevices.get(userData.deviceId);
        if (device) {
          setUserData(prev => prev ? {
            ...prev,
            dailyMessagesUsed: device.messages_today || 0,
            voiceNotesUsed: typeof device.voice_notes_used === 'number'
              ? device.voice_notes_used
              : 0,
          } : null);
        }
      }
    } catch (error) {
      console.error('Error refreshing user data after chat:', error);
    }
  }, [userData]);

  const incrementMessageCount = useCallback(async () => {
    if (!userData) return;
    await updateUserData({
      dailyMessagesUsed: (userData.dailyMessagesUsed || 0) + 1,
    });
    await refreshUserDataAfterChat();
  }, [userData, updateUserData, refreshUserDataAfterChat]);

  const incrementVoiceNoteCount = useCallback(async () => {
    if (!userData) return;
    await updateUserData({
      voiceNotesUsed: (userData.voiceNotesUsed || 0) + 1,
    });
    await refreshUserDataAfterChat();
  }, [userData, updateUserData, refreshUserDataAfterChat]);

  const resetDailyLimits = useCallback(async () => {
    if (!userData) return;
    const today = new Date().toISOString().split('T')[0];
    await updateUserData({
      dailyMessagesUsed: 0,
      voiceNotesUsed: 0,
      lastResetDate: today
    });
  }, [userData, updateUserData]);

  const recordMessage = useCallback(async () => {
    if (!userData) return;
    const newCount = (userData.dailyMessagesUsed || 0) + 1;
    await updateUserData({ dailyMessagesUsed: newCount });
  }, [userData, updateUserData]);

  const recordVoiceNote = useCallback(async () => {
    if (!userData) return;
    const newCount = (userData.voiceNotesUsed || 0) + 1;
    await updateUserData({ voiceNotesUsed: newCount });
  }, [userData, updateUserData]);

  const value = useMemo(() => {
    // Judge accounts get unlimited access and are treated as premium
    const isJudge = userData?.isJudge === true;
    const isPremium = isJudge || userData?.subscription_status === 'active' || userData?.currentPlan === 'monthly_trial' || userData?.currentPlan === 'yearly_trial';
    const isTrial = userData?.subscription_status === 'trialing';
    const isAnonymous = userData?.isAuthenticated === false;
    const isFreemium = userData?.isAuthenticated === true && userData?.currentPlan === 'freemium' && !isJudge;
    
    let limits: UserLimits;
    if (isJudge) {
      // Judge accounts: unlimited everything
      limits = {
        hasLimits: false,
        maxMessages: Infinity,
        messagesUsed: userData?.dailyMessagesUsed || 0,
        messagesRemaining: Infinity,
        maxVoiceNotes: Infinity,
        voiceNotesUsed: userData?.voiceNotesUsed || 0,
        voiceNotesRemaining: Infinity,
        resetsOn: 'Never'
      };
    } else if (isPremium || isTrial) {
      // Premium and trial users: unlimited messages, but 50 voice notes per day (match backend)
      limits = {
        hasLimits: true, // Only voice notes are limited
        maxMessages: Infinity,
        messagesUsed: userData?.dailyMessagesUsed || 0,
        messagesRemaining: Infinity,
        maxVoiceNotes: 50,
        voiceNotesUsed: userData?.voiceNotesUsed || 0,
        voiceNotesRemaining: Math.max(0, 50 - (userData?.voiceNotesUsed || 0)),
        resetsOn: 'Never'
      };
    } else if (isFreemium) {
      limits = {
        hasLimits: true,
        maxMessages: 5,
        messagesUsed: userData?.dailyMessagesUsed || 0,
        messagesRemaining: Math.max(0, 5 - (userData?.dailyMessagesUsed || 0)),
        maxVoiceNotes: 1,
        voiceNotesUsed: userData?.voiceNotesUsed || 0,
        voiceNotesRemaining: Math.max(0, 1 - (userData?.voiceNotesUsed || 0)),
        resetsOn: userData?.lastResetDate || today
      };
    } else if (isAnonymous) {
      limits = {
        hasLimits: true,
        maxMessages: 3,
        messagesUsed: userData?.dailyMessagesUsed || 0,
        messagesRemaining: Math.max(0, 3 - (userData?.dailyMessagesUsed || 0)),
        maxVoiceNotes: 0,
        voiceNotesUsed: 0,
        voiceNotesRemaining: 0,
        resetsOn: userData?.lastResetDate || today
      };
    } else {
      limits = {
        hasLimits: true,
        maxMessages: 3,
        messagesUsed: userData?.dailyMessagesUsed || 0,
        messagesRemaining: Math.max(0, 3 - (userData?.dailyMessagesUsed || 0)),
        maxVoiceNotes: 0,
        voiceNotesUsed: 0,
        voiceNotesRemaining: 0,
        resetsOn: userData?.lastResetDate || today
      };
    }
    return {
      userData,
      supabaseUser,
      setUserData,
      updateUserData,
      isLoading,
      clearUserData,
      refreshUserData,
      limits,
      recordMessage,
      recordVoiceNote,
      incrementMessageCount,
      incrementVoiceNoteCount,
      resetDailyLimits,
      isPremiumUser: () => isPremium,
      isFreemiumUser: () => isFreemium,
      isAnonymousUser: () => isAnonymous,
      isActiveTrialUser: () => isTrial,
      refreshUserDataAfterChat,
    };
  }, [supabaseUser, userData, isLoading, recordMessage, recordVoiceNote, incrementMessageCount, incrementVoiceNoteCount, refreshUserDataAfterChat, refreshUserData, resetDailyLimits, today, updateUserData]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export { UserContext };