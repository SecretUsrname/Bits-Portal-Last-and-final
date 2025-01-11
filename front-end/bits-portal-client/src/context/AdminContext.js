// src/context/AdminContext.js
import React, { createContext, useContext, useState } from 'react';

// Create AdminContext
const AdminContext = createContext();

// AdminProvider component to wrap around components that need AdminId access
export const AdminProvider = ({ children }) => {
  const [AdminId, setAdminId] = useState(null);

  const uid = (id) => {
    localStorage.setItem('id', id); 
    setAdminId(id);
  };

  return (
    <AdminContext.Provider value={{ AdminId, setAdminId, uid }}>
      {children}
    </AdminContext.Provider>
  );
};

// Custom hook to use AdminContext easily
export const useAdmin = () => {
  return useContext(AdminContext);
};

// Export AdminContext for direct import if needed
export default AdminContext;
