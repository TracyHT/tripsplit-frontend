import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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

const TOKEN_KEY = 'authToken';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchCurrentUser = useCallback(async (): Promise<User> => {
    try {
      const response = await authApi.getCurrentUser();
      const userData = response.data?.data || response.data;

      if (!userData || !userData._id) {
        throw new Error('Invalid user data received');
      }

      return userData;
    } catch (error) {
      localStorage.removeItem(TOKEN_KEY);
      throw error;
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem(TOKEN_KEY);

      if (token) {
        try {
          const userData = await fetchCurrentUser();
          if (userData) {
            setUser(userData);
          }
        } catch (error) {
          setUser(null);
        }
      }

      setIsLoading(false);
      setIsInitialized(true);
    };

    initializeAuth();
  }, [fetchCurrentUser]);

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      const data = response.data;

      if (!data.token) {
        throw new Error('No token received from server');
      }

      localStorage.setItem(TOKEN_KEY, data.token);
      const { token, ...userData } = data;

      if (!userData._id || !userData.email) {
        throw new Error('Invalid user data received');
      }

      setUser(userData as User);
    } catch (error) {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const response = await authApi.register({ email, password, name });
      const data = response.data;

      if (!data.token) {
        throw new Error('No token received from server');
      }

      localStorage.setItem(TOKEN_KEY, data.token);
      const { token, ...userData } = data;

      if (!userData._id || !userData.email) {
        throw new Error('Invalid user data received');
      }

      setUser(userData as User);
    } catch (error) {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
      throw error;
    }
  };

  const logout = async () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  const refreshUser = async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      throw new Error('No token available');
    }

    try {
      const userData = await fetchCurrentUser();
      setUser(userData);
    } catch (error) {
      setUser(null);
      throw error;
    }
  };

  const loginWithGoogle = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    window.location.href = `${apiUrl.replace('/api', '')}/api/auth/google`;
  };

  const handleOAuthCallback = async (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);

    try {
      const userData = await fetchCurrentUser();
      if (userData) {
        setUser(userData);
      }
    } catch (error) {
      localStorage.removeItem(TOKEN_KEY);
      throw error;
    }
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 animate-spin mx-auto rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Initializing...</p>
        </div>
      </div>
    );
  }

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
