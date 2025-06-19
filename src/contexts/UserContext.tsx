import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserData {
  // User identification
  name: string;
  
  // Personalization data
  country?: string;
  feeling?: string;
  
  // Authentication state
  isAuthenticated: boolean;
  
  // Usage tracking (client-side only)
  dailyMessagesUsed?: number;
  voiceNotesUsed?: number;
  lastResetDate?: string;
  
  // Device tracking for anonymous users
  deviceId?: string;
}

interface UserContextType {
  userData: UserData | null;
  isLoading: boolean;
  setUserData: (data: UserData | null) => void;
  updateUserData: (updates: Partial<UserData>) => void;
  clearUserData: () => void;
  incrementMessageCount: () => void;
  incrementVoiceNoteCount: () => void;
  resetDailyLimits: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userData, setUserDataState] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize user data from localStorage
  useEffect(() => {
    const initializeUser = () => {
      try {
        // Check if user has completed onboarding
        const onboardingComplete = localStorage.getItem('amaraOnboardingComplete') === 'true';
        const userName = localStorage.getItem('amaraUserName');
        
        if (onboardingComplete && userName) {
          // Load existing user data
          const savedUserData = localStorage.getItem('amaraUserData');
          if (savedUserData) {
            const parsedData = JSON.parse(savedUserData);
            setUserDataState(parsedData);
          } else {
            // Create basic user data from stored name
            setUserDataState({
              name: userName,
              isAuthenticated: false,
              dailyMessagesUsed: 0,
              voiceNotesUsed: 0,
              lastResetDate: new Date().toISOString().split('T')[0]
            });
          }
        }
      } catch (error) {
        console.error('Error initializing user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeUser();
  }, []);

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (userData) {
      localStorage.setItem('amaraUserData', JSON.stringify(userData));
    }
  }, [userData]);

  const setUserData = (data: UserData | null) => {
    setUserDataState(data);
    if (data) {
      localStorage.setItem('amaraUserData', JSON.stringify(data));
    } else {
      localStorage.removeItem('amaraUserData');
    }
  };

  const updateUserData = (updates: Partial<UserData>) => {
    if (!userData) return;

    const updatedData = { ...userData, ...updates };
    setUserDataState(updatedData);
    localStorage.setItem('amaraUserData', JSON.stringify(updatedData));
  };

  const clearUserData = () => {
    setUserDataState(null);
    localStorage.removeItem('amaraUserData');
    localStorage.removeItem('amaraUserName');
    localStorage.removeItem('amaraOnboardingComplete');
  };

  const incrementMessageCount = () => {
    if (!userData) return;

    const newCount = (userData.dailyMessagesUsed || 0) + 1;
    updateUserData({ dailyMessagesUsed: newCount });
  };

  const incrementVoiceNoteCount = () => {
    if (!userData) return;

    const newCount = (userData.voiceNotesUsed || 0) + 1;
    updateUserData({ voiceNotesUsed: newCount });
  };

  const resetDailyLimits = () => {
    if (!userData) return;

    const today = new Date().toISOString().split('T')[0];
    updateUserData({
      dailyMessagesUsed: 0,
      voiceNotesUsed: 0,
      lastResetDate: today
    });
  };

  const value: UserContextType = {
    userData,
    isLoading,
    setUserData,
    updateUserData,
    clearUserData,
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