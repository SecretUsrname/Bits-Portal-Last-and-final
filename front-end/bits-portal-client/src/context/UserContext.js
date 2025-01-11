// src/context/UserContext.js
import React, { createContext, useContext, useState } from 'react';

// Create UserContext
const UserContext = createContext();

// UserProvider component to wrap around components that need userId access
export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);

  const uid = (id) => {
    localStorage.setItem('id', id); 
    setUserId(id);
  };

  return (
    <UserContext.Provider value={{ userId, setUserId, uid }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use UserContext easily
export const useUser = () => {
  return useContext(UserContext);
};

// Export UserContext for direct import if needed
export default UserContext;
