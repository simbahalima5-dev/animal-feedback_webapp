import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_USERS } from '../data/initialData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('fauna_users');
    return savedUsers ? JSON.parse(savedUsers) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const savedSession = localStorage.getItem('fauna_current_user');
    return savedSession ? JSON.parse(savedSession) : null;
  });

  useEffect(() => {
    localStorage.setItem('fauna_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('fauna_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('fauna_current_user');
    }
  }, [currentUser]);

  // Register Handler
  const register = (username, password, confirmPassword) => {
    const cleanUsername = username.trim();
    if (!cleanUsername) {
      return { success: false, message: 'Username cannot be empty.' };
    }
    if (cleanUsername.length < 3) {
      return { success: false, message: 'Username must be at least 3 characters.' };
    }
    if (!password) {
      return { success: false, message: 'Password is required.' };
    }
    if (password.length < 4) {
      return { success: false, message: 'Password must be at least 4 characters long.' };
    }
    if (password !== confirmPassword) {
      return { success: false, message: 'Passwords do not match!' };
    }

    const existingUser = users.find(
      u => u.username.toLowerCase() === cleanUsername.toLowerCase()
    );
    if (existingUser) {
      return { success: false, message: 'Username is already taken. Please choose another.' };
    }

    // Avatar color generator based on username string
    const colors = ['#10b981', '#06b6d4', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6'];
    const avatarColor = colors[Math.floor(Math.random() * colors.length)];

    const newUser = {
      username: cleanUsername,
      password: password,
      avatarColor: avatarColor,
      joinedDate: new Date().toISOString().split('T')[0]
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return { success: true, message: `Account created! Welcome, @${cleanUsername} 🎉` };
  };

  // Login Handler
  const login = (username, password) => {
    const cleanUsername = username.trim();
    if (!cleanUsername || !password) {
      return { success: false, message: 'Please enter both username and password.' };
    }

    const foundUser = users.find(
      u => u.username.toLowerCase() === cleanUsername.toLowerCase()
    );

    if (!foundUser) {
      return { success: false, message: 'User not found. Check username or register a new account.' };
    }

    if (foundUser.password !== password) {
      return { success: false, message: 'Incorrect password. Please try again.' };
    }

    setCurrentUser(foundUser);
    return { success: true, message: `Welcome back, @${foundUser.username}! 👋` };
  };

  // Logout Handler
  const logout = () => {
    setCurrentUser(null);
    return { success: true, message: 'Logged out successfully.' };
  };

  return (
    <AuthContext.Provider value={{ currentUser, register, login, logout, users }}>
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
