import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../services/api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (authAPI.isAuthenticated()) {
        try {
          const userData = await authAPI.getProfile();
          setUser(userData);
        } catch (error) {
          console.error('Failed to load user profile:', error);
          authAPI.logout();
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      await authAPI.login({ username, password });
      const userData = await authAPI.getProfile();
      setUser(userData);
    // eslint-disable-next-line no-useless-catch
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      await authAPI.signup({ username, email, password });
    // eslint-disable-next-line no-useless-catch
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear authentication data
    authAPI.logout();
    // Reset user state
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};