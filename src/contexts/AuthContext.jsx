import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentAdmin, signOutAdmin } from '../lib/supabase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing admin session
    const checkAdminSession = () => {
      const adminData = getCurrentAdmin();
      setUser(adminData);
      setLoading(false);
    };

    checkAdminSession();

    // Check session periodically
    const interval = setInterval(checkAdminSession, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const logout = () => {
    signOutAdmin();
    setUser(null);
  };

  const login = (adminData) => {
    setUser(adminData);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      logout, 
      login,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};