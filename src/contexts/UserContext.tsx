import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, db, generateDeviceId, UserProfile, AnonymousDevice } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

export interface UserData {
  // User identification
  id?: string;
  name: string;
  email?: string;
  
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

    const initializeUser = async () => {
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setSupabaseUser(session.user);
          await loadAuthenticatedUser(session.user);
        } else {
          await loadAnonymousUser();
        }
      } catch (error) {
        console.error('Error initializing user:', error);
        await loadAnonymousUser();
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      setSupabaseUser(session?.user || null);

      if (event === 'SIGNED_IN' && session?.user) {
        await loadAuthenticatedUser(session.user);
      } else if (event === 'SIGNED_OUT') {
        await loadAnonymousUser();
      }
    });

    initializeUser();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const loadAuthenticatedUser = async (user: User) => {
    try {
      let profile = await db.profiles.get(user.id);
      
      // Create profile if it doesn't exist
      if (!profile) {
        const name = user.user_metadata?.name || user.email?.split('@')[0] || 'User';
        profile = await db.profiles.create(user.id, user.email!, name);
      }

      setUserDataState({
        id: profile.id,
        name: profile.name,
        email: profile.email,
        isAuthenticated: true,
        currentPlan: profile.current_plan,
        trialStartDate: profile.trial_start_date,
        trialEndDate: profile.trial_end_date,
        createdAt: profile.created_at,
        dailyMessagesUsed: 0, // Reset for authenticated users daily
        voiceNotesUsed: 0,
        lastResetDate: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      console.error('Error loading authenticated user:', error);
      // Fallback to basic user data
      setUserDataState({
        id: user.id,
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        email: user.email,
        isAuthenticated: true,
        currentPlan: 'freemium',
        createdAt: new Date().toISOString()
      });
    }
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
        name: 'Anonymous User',
        isAuthenticated: false,
        currentPlan: 'freemium',
        deviceId: validDeviceId, // Only set if we have a valid database record
        dailyMessagesUsed: device?.messages_today || 0,
        voiceNotesUsed: device?.voice_notes_used ? 1 : 0,
        lastResetDate: device?.last_active_date || new Date().toISOString().split('T')[0],
        createdAt: device?.created_at || new Date().toISOString()
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
        createdAt: new Date().toISOString()
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
            console.error('Error updating anonymous device:', updateError);
            
            // If the record doesn't exist, remove deviceId from userData to prevent future attempts
            if (updateError.message?.includes('0 rows') || updateError.code === 'PGRST116') {
              console.log('Device record no longer exists, switching to local-only mode');
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
    await updateUserData({ dailyMessagesUsed: newCount });
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
    resetDailyLimits
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