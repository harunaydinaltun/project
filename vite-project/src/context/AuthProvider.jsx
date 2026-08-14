import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "./AuthContext";

export const AuthContextProvider = ({ children }) => {
  const checkInitialAuth = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          return null;
        }
        return storedUser;
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return null;
      }
    }
    return storedUser || null;
  };

  const [currentUser, setCurrentUser] = useState(checkInitialAuth);

  const login = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, setCurrentUser, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
