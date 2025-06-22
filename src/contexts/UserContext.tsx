import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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

interface UserContextType {
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
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userData, setUserDataState] = useState<UserData | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize user data and auth state
  useEffect(() => {
    let mounted = true;
    setIsLoading(true);

    // The onAuthStateChange listener will handle all auth events.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      // We only care about the initial session establishment and SIGNED_IN events.
      // SIGNED_OUT is handled manually by the handleLogout function in App.tsx.
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
        // When logout happens, App.tsx handles state clearing and navigation.
        // The context will be re-initialized with an anonymous user on the next page load
        // or when the user signs in again. Here, we just ensure loading is false.
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

      // Create profile if it doesn't exist
      if (!profile) {
        console.log(`No profile found for user ${user.id}, creating a new one.`);
        const name = user.user_metadata?.name || user.email?.split('@')[0] || 'User';
        try {
          profile = await db.profiles.create(user.id, user.email!, name);
        } catch (createError: any) {
          console.error('Error creating user profile:', createError);
          // If profile creation fails, we cannot proceed.
          // Log out the user to prevent an inconsistent state.
          await supabase.auth.signOut();
          return; 
        }
      }
    } catch (error: any) {
      console.error('Error loading or creating authenticated user profile:', error);
      // If we can't get or create a profile, something is wrong. Log out.
      await supabase.auth.signOut();
      return;
    }

    // If, after all attempts, the profile is still not available, we can't continue.
    if (!profile) {
      console.error('Failed to load or create a user profile. Aborting sign-in.');
      await supabase.auth.signOut();
      return;
    }

    setUserDataState({
      id: profile.id,
      name: profile.name,
      email: profile.email,
      profile_image_url: profile.profile_image_url,
      isAuthenticated: true,
      currentPlan: profile.current_plan,
      trialStartDate: profile.trial_start_date,
      trialEndDate: profile.trial_end_date,
      createdAt: profile.created_at,
      dailyMessagesUsed: 0, // Reset for authenticated users daily
      voiceNotesUsed: 0,
      lastResetDate: new Date().toISOString().split('T')[0],
      subscription_status: profile.subscription_status,
      trial_ends_at: profile.trial_ends_at
    });
  };

  const loadAnonymousUser = async () => {
    try {
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
        console.log('Device record not found, will create new one');
      }
      
      // If device doesn't exist, create it
      if (!device) {
        try {
          device = await db.anonymousDevices.create(deviceId);
          if (device) {
            validDeviceId = device.device_id;
          }
        } catch (createError: any) {
          // If creation fails due to duplicate key, try to fetch again
          if (createError.code === '23505') {
            console.log('Device already exists (race condition), fetching existing record');
            try {
              device = await db.anonymousDevices.get(deviceId);
              if (device) {
                validDeviceId = device.device_id;
              }
            } catch (fetchError) {
              console.error('Failed to fetch existing device after duplicate key error:', fetchError);
              // Fall back to creating a new device ID
              const newDeviceId = 'device_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
              localStorage.setItem('amara_device_id', newDeviceId);
              try {
                device = await db.anonymousDevices.create(newDeviceId);
                if (device) {
                  validDeviceId = device.device_id;
                }
              } catch (finalError) {
                console.error('Failed to create fallback device:', finalError);
                // Don't set validDeviceId, will fall back to local-only mode
              }
            }
          } else {
            console.error('Failed to create device record:', createError);
            // Don't set validDeviceId, will fall back to local-only mode
          }
        }
      } else {
        // Check if we need to reset daily limits
        const today = new Date().toISOString().split('T')[0];
        if (device.last_active_date !== today) {
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
      }

      // Set user data - only include deviceId if we have a valid database record
      setUserDataState({
        name: localStorage.getItem('amaraUserName') || 'Anonymous User',
        isAuthenticated: false,
        currentPlan: 'freemium',
        deviceId: validDeviceId, // Only set if we have a valid database record
        dailyMessagesUsed: device?.messages_today || 0,
        voiceNotesUsed: device?.voice_notes_used ? 1 : 0,
        lastResetDate: device?.last_active_date || new Date().toISOString().split('T')[0],
        createdAt: device?.created_at || new Date().toISOString(),
        subscription_status: null,
        trial_ends_at: null
      });
    } catch (error) {
      console.error('Error loading anonymous user:', error);
      // Fallback to basic anonymous user without database persistence
      setUserDataState({
        name: 'Anonymous User',
        isAuthenticated: false,
        currentPlan: 'freemium',
        // No deviceId - this will prevent database operations
        dailyMessagesUsed: 0,
        voiceNotesUsed: 0,
        lastResetDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        subscription_status: null,
        trial_ends_at: null
      });
    }
  };

  const setUserData = (data: UserData | null) => {
    setUserDataState(data);
  };

  const updateUserData = async (updates: Partial<UserData>) => {
    if (!userData) return;

    const updatedData = { ...userData, ...updates };
    setUserDataState(updatedData);

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
          } catch (updateError: any) {
            console.warn('Error updating anonymous device (switching to local-only mode):', updateError);
            
            // If the record doesn't exist or there's an RLS issue, remove deviceId from userData
            // This prevents future database update attempts and switches to local-only mode
            if (updateError.message?.includes('0 rows') || 
                updateError.code === 'PGRST116' || 
                updateError.code === '42501') {
              console.log('Device record no longer exists or access denied, switching to local-only mode');
              setUserDataState(prev => prev ? { ...prev, deviceId: undefined } : null);
            }
          }
        }
      }
      // If no deviceId, we're in local-only mode and don't persist to database
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const clearUserData = () => {
    setUserDataState(null);
    setSupabaseUser(null);
  };

  const refreshUserData = async () => {
    if (supabaseUser) {
      await loadAuthenticatedUser(supabaseUser);
    } else {
      await loadAnonymousUser();
    }
  };

  const incrementMessageCount = async () => {
    if (!userData) return;

    const newCount = (userData.dailyMessagesUsed || 0) + 1;

    // Optimistically update local state
    setUserDataState(prev => prev ? { ...prev, dailyMessagesUsed: newCount } : null);

    // Persist to database
    if (userData.isAuthenticated && userData.id) {
      // This part is for authenticated users and may be implemented later
      // For now, we are focusing on anonymous users
    } else if (!userData.isAuthenticated && userData.deviceId) {
      try {
        await db.anonymousDevices.update(userData.deviceId, { messages_today: newCount });
      } catch (error) {
        console.error('Failed to update message count for anonymous user:', error);
        // Optionally, revert optimistic update
        setUserDataState(prev => prev ? { ...prev, dailyMessagesUsed: prev.dailyMessagesUsed! - 1 } : null);
      }
    }
  };

  const incrementVoiceNoteCount = async () => {
    if (!userData) return;

    const newCount = (userData.voiceNotesUsed || 0) + 1;
    await updateUserData({ voiceNotesUsed: newCount });
  };

  const resetDailyLimits = async () => {
    if (!userData) return;

    const today = new Date().toISOString().split('T')[0];
    await updateUserData({
      dailyMessagesUsed: 0,
      voiceNotesUsed: 0,
      lastResetDate: today
    });
  };

  const value: UserContextType = {
    userData,
    supabaseUser,
    isLoading,
    setUserData,
    updateUserData,
    clearUserData,
    refreshUserData,
    incrementMessageCount,
    incrementVoiceNoteCount,
    resetDailyLimits,
    limits: {
      hasLimits: true,
      maxMessages: 1000,
      messagesUsed: userData?.dailyMessagesUsed || 0,
      messagesRemaining: Math.max(0, 1000 - (userData?.dailyMessagesUsed || 0)),
      maxVoiceNotes: 100,
      voiceNotesUsed: userData?.voiceNotesUsed || 0,
      voiceNotesRemaining: Math.max(0, 100 - (userData?.voiceNotesUsed || 0)),
      resetsOn: userData?.lastResetDate || today
    },
    recordMessage: () => {},
    recordVoiceNote: () => {},
    isPremiumUser: () => userData?.currentPlan === 'monthly_premium' || userData?.currentPlan === 'yearly_premium',
    isFreemiumUser: () => userData?.currentPlan === 'freemium',
    isAnonymousUser: () => !userData?.isAuthenticated && !userData?.deviceId,
    isActiveTrialUser: () => userData?.currentPlan === 'monthly_trial' || userData?.currentPlan === 'yearly_trial'
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};