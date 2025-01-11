// src/context/AdminAuthContext.js
import React, { createContext, useContext, useState } from 'react';

const AdminAuthContext = createContext();

export const useAdminAuth = () => useContext(AdminAuthContext);

export const AdminAuthProvider = ({ children }) => {
  const [isAuthenticatedAdmin, setIsAuthenticatedAdmin] = useState(localStorage.getItem('isAuthenticatedAdmin') === 'true');
  const loginAdmin = () => {
    localStorage.setItem('isAuthenticatedAdmin', 'true');
    setIsAuthenticatedAdmin(true);
  }
  
  const Adminlogout = () => {
    localStorage.removeItem('isAuthenticatedAdmin');
    setIsAuthenticatedAdmin(false);
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticatedAdmin, Adminlogout, loginAdmin}}>
      {children}
    </AdminAuthContext.Provider>
  );
};
