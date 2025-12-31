import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthSession, LoginCredentials, RestaurantProfile } from '@/types';

interface AuthContextType {
  session: AuthSession | null;
  restaurant: RestaurantProfile | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateRestaurant: (profile: RestaurantProfile) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [restaurant, setRestaurant] = useState<RestaurantProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on app start
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const savedSession = await AsyncStorage.getItem('auth_session');
        const savedRestaurant = await AsyncStorage.getItem('restaurant_profile');

        if (savedSession) {
          setSession(JSON.parse(savedSession));
        }
        if (savedRestaurant) {
          setRestaurant(JSON.parse(savedRestaurant));
        }
      } catch (error) {
        console.error('Failed to restore session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      // Mock authentication - in production, call your backend API
      if (!credentials.email || !credentials.password) {
        throw new Error('Email and password are required');
      }

      // Simulate API call
      const mockSession: AuthSession = {
        restaurantId: 'rest_' + Math.random().toString(36).substr(2, 9),
        restaurantName: 'My Restaurant',
        email: credentials.email,
        createdAt: Date.now(),
      };

      const mockRestaurant: RestaurantProfile = {
        id: mockSession.restaurantId,
        name: 'My Restaurant',
        address: '123 Main Street, City, State',
        phone: '(555) 123-4567',
        email: credentials.email,
        isOpen: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await AsyncStorage.setItem('auth_session', JSON.stringify(mockSession));
      await AsyncStorage.setItem('restaurant_profile', JSON.stringify(mockRestaurant));

      setSession(mockSession);
      setRestaurant(mockRestaurant);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('auth_session');
      await AsyncStorage.removeItem('restaurant_profile');
      setSession(null);
      setRestaurant(null);
    } catch (error) {
      console.error('Failed to logout:', error);
      throw error;
    }
  };

  const updateRestaurant = async (profile: RestaurantProfile) => {
    try {
      const updatedProfile = {
        ...profile,
        updatedAt: Date.now(),
      };
      await AsyncStorage.setItem('restaurant_profile', JSON.stringify(updatedProfile));
      setRestaurant(updatedProfile);
    } catch (error) {
      console.error('Failed to update restaurant profile:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        restaurant,
        isLoading,
        login,
        logout,
        updateRestaurant,
        isAuthenticated: session !== null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
