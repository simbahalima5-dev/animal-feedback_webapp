'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authApi } from '../lib/api';

interface AuthContextType {
  currentUser: User | null;
  login: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (username: string, password: string, confirmPassword?: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('fauna_current_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (err) {
        localStorage.removeItem('fauna_current_user');
      }
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const res = await authApi.login(username, password);
      const user = res.user || { username, avatarColor: '#10b981' };
      setCurrentUser(user);
      localStorage.setItem('fauna_current_user', JSON.stringify(user));
      return { success: true, message: res.message || `Welcome back, @${username}!` };
    } catch (err: any) {
      return { success: false, message: err.message || 'Login failed.' };
    }
  };

  const register = async (username: string, password: string, confirmPassword?: string) => {
    try {
      const res = await authApi.register(username, password, confirmPassword);
      const user = res.user || { username, avatarColor: '#10b981' };
      setCurrentUser(user);
      localStorage.setItem('fauna_current_user', JSON.stringify(user));
      return { success: true, message: res.message || `Account created! Welcome @${username} 🎉` };
    } catch (err: any) {
      return { success: false, message: err.message || 'Registration failed.' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('fauna_current_user');
    localStorage.removeItem('fauna_jwt_token');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
