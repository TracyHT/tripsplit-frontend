import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '@/lib/api';
import type { User } from '@/types/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  loginWithGoogle: () => void;
  handleOAuthCallback: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await authApi.getCurrentUser();
          setUser(response.data);
        } catch (error) {
          // Token is invalid, clear it
          localStorage.removeItem('authToken');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });

    // Backend returns user data with token in the response
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      // Set user data (excluding token)
      const { token, ...userData } = response.data;
      setUser(userData as User);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    const response = await authApi.register({ email, password, name });

    // Backend returns user data with token
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      const { token, ...userData } = response.data;
      setUser(userData as User);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      // Even if logout fails on server, clear local state
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      setUser(null);
    }
  };

  const refreshUser = async () => {
    const response = await authApi.getCurrentUser();
    setUser(response.data);
  };

  // Google OAuth - redirect to backend OAuth endpoint
  const loginWithGoogle = () => {
    // Backend will handle OAuth flow and redirect back to /profile?token=...
    window.location.href = `${import.meta.env.VITE_API_URL.replace('/api', '')}/api/auth/google`;
  };

  // Handle OAuth callback when redirected back from backend
  const handleOAuthCallback = async (token: string) => {
    localStorage.setItem('authToken', token);
    try {
      const response = await authApi.getCurrentUser();
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user after OAuth:', error);
      localStorage.removeItem('authToken');
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        register,
        refreshUser,
        loginWithGoogle,
        handleOAuthCallback,
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
