'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userData, setUserDataState] = useState(null);

  // On mount, load from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      setUserDataState(JSON.parse(storedUser));
    }
  }, []);

  // When setting data, also save to localStorage
  const setUserData = (data) => {
    setUserDataState(data);
    localStorage.setItem('userData', JSON.stringify(data));
  };

  return (
    <AuthContext.Provider value={{ userData, setUserData }}>
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
