/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState({
    admin: false,
    dealer: false,
    subdealer: false,
  });

  const login = (role) =>
    setIsAuthenticated((prev) => ({ ...prev, [role]: true }));
  const logout = (role) =>
    setIsAuthenticated((prev) => ({ ...prev, [role]: false }));

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
