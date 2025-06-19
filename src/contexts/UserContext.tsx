import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, db, generateDeviceId, UserProfile, AnonymousDevice } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface UserData {
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
  currentPlan?: 'freemium' | 'monthly_trial' | 'yearly_trial' | 'monthly_paid' | 'yearly_paid';
  trialStartDate?: string;
  trialEndDate?: string;
  
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
        dailyMessagesUsed: 0, // Reset for authenticated users
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
        currentPlan: 'freemium'
      });
    }
  };

  const loadAnonymousUser = async () => {
    try {
      const deviceId = generateDeviceId();
      let device = await db.anonymousDevices.get(deviceId);
      
      // Create device record if it doesn't exist
      if (!device) {
        device = await db.anonymousDevices.create(deviceId);
      } else {
        // Check if we need to reset daily limits
        const today = new Date().toISOString().split('T')[0];
        if (device.last_active_date !== today) {
          device = await db.anonymousDevices.resetDailyLimits(deviceId);
        }
      }

      setUserDataState({
        name: 'Anonymous User',
        isAuthenticated: false,
        currentPlan: 'freemium',
        deviceId: device.device_id,
        dailyMessagesUsed: device.messages_today,
        voiceNotesUsed: device.voice_notes_used ? 1 : 0,
        lastResetDate: device.last_active_date
      });
    } catch (error) {
      console.error('Error loading anonymous user:', error);
      // Fallback to basic anonymous user
      setUserDataState({
        name: 'Anonymous User',
        isAuthenticated: false,
        currentPlan: 'freemium',
        deviceId: generateDeviceId(),
        dailyMessagesUsed: 0,
        voiceNotesUsed: 0,
        lastResetDate: new Date().toISOString().split('T')[0]
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
        // Update anonymous device
        const deviceUpdates: Partial<AnonymousDevice> = {};
        if (updates.dailyMessagesUsed !== undefined) deviceUpdates.messages_today = updates.dailyMessagesUsed;
        if (updates.voiceNotesUsed !== undefined) deviceUpdates.voice_notes_used = updates.voiceNotesUsed > 0;
        if (updates.lastResetDate) deviceUpdates.last_active_date = updates.lastResetDate;

        if (Object.keys(deviceUpdates).length > 0) {
          await db.anonymousDevices.update(userData.deviceId, deviceUpdates);
        }
      }
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