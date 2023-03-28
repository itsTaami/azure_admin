import { React, createContext, useState } from 'react';

export const TravelContext = createContext();

const TravelProvider = ({ children }) => {
  const [travel, setTravel] = useState(null);

  const [filteredTravel, setFilteredTravel] = useState([]);
  return (
    <AuthContext.Provider value={{ travel, setTravel, filteredTravel, setFilteredTravel }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
