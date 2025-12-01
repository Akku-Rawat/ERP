import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'isAuthenticated';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Initialize from localStorage
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    return stored === 'true';
  });

  // Sync state changes to localStorage
  useEffect(() => {
    localStorage.setItem(AUTH_STORAGE_KEY, String(isAuthenticated));
  }, [isAuthenticated]);

  const login = async (email: string, password: string) => {
    if (email === 'admin' && password === 'admin') {
      setIsAuthenticated(true);
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_STORAGE_KEY); // Optional: clean up
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};