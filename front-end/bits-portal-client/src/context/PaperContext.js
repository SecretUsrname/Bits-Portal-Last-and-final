// src/context/PaperContext.js
import React, { createContext, useContext, useState } from 'react';

// Create PaperContext
const PaperContext = createContext();

// PaperProvider component to wrap around components that need PaperId access
export const PaperProvider = ({ children }) => {
  const [PaperId, setPaperId] = useState(null);

  const pid = (id) => {
    localStorage.setItem('pid', id); 
    setPaperId(id);
  };

  return (
    <PaperContext.Provider value={{ PaperId, setPaperId, pid }}>
      {children}
    </PaperContext.Provider>
  );
};

// Custom hook to use PaperContext easily
export const usePaper = () => {
  return useContext(PaperContext);
};

// Export PaperContext for direct import if needed
export default PaperContext;
