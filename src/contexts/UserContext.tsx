import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserData {
  name: string;
  email?: string;
  country?: string;
  feeling?: string;
  isAuthenticated: boolean;
  currentPlan?: 'freemium' | 'monthly_trial' | 'yearly_trial' | 'monthly_premium' | 'yearly_premium';
}

interface UserContextType {
  userData: UserData | null;
  setUserData: (data: UserData | null) => void;
  updateUserData: (updates: Partial<UserData>) => void;
  clearUserData: () => void;
  isUserDataLoaded: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userData, setUserDataState] = useState<UserData | null>(null);
  const [isUserDataLoaded, setIsUserDataLoaded] = useState(false);

  // Load user data from localStorage on mount
  useEffect(() => {
    const loadUserData = () => {
      try {
        const storedUserData = localStorage.getItem('amaraUserData');
        if (storedUserData) {
          const parsedData = JSON.parse(storedUserData);
          setUserDataState(parsedData);
        }
      } catch (error) {
        console.error('Error loading user data from localStorage:', error);
        // Clear corrupted data
        localStorage.removeItem('amaraUserData');
      } finally {
        setIsUserDataLoaded(true);
      }
    };

    loadUserData();
  }, []);

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (isUserDataLoaded) {
      if (userData) {
        localStorage.setItem('amaraUserData', JSON.stringify(userData));
      } else {
        localStorage.removeItem('amaraUserData');
      }
    }
  }, [userData, isUserDataLoaded]);

  const setUserData = (data: UserData | null) => {
    setUserDataState(data);
  };

  const updateUserData = (updates: Partial<UserData>) => {
    setUserDataState(prev => prev ? { ...prev, ...updates } : null);
  };

  const clearUserData = () => {
    setUserDataState(null);
    localStorage.removeItem('amaraUserData');
  };

  const value: UserContextType = {
    userData,
    setUserData,
    updateUserData,
    clearUserData,
    isUserDataLoaded
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