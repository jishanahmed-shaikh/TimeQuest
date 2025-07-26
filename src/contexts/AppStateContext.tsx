import React, { createContext, useContext, useState, useCallback } from 'react';
import { MockAuthService, User } from '@/services/mockData';

interface AppStateContextType {
  userProfile: User | null;
  refreshUserProfile: () => Promise<void>;
  updateCoins: (newCoins: number) => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<User | null>(null);

  const refreshUserProfile = useCallback(async () => {
    try {
      const profile = MockAuthService.getUserProfile();
      setUserProfile(profile);
    } catch (error) {
      console.error('Error refreshing user profile:', error);
    }
  }, []);

  const updateCoins = useCallback((newCoins: number) => {
    setUserProfile(prev => prev ? { ...prev, coins: newCoins } : null);
  }, []);

  const value = {
    userProfile,
    refreshUserProfile,
    updateCoins,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
};