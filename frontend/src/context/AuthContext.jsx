import { createContext, useContext, useState } from "react";
import { authApi } from "../api/auth.api";

const AuthContext = createContext(null);

const loadUserFromStorage = () => {
  try {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(loadUserFromStorage);
  const loading = false;

  const persistUser = (userData) => {
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("user");
    }
    setUser(userData);
  };

  const login = async (credentials) => {
    const res = await authApi.login(credentials);
    localStorage.setItem("token", res.data.token);
    persistUser(res.data.user);
    return res.data;
  };

  const register = async (data) => {
    const res = await authApi.register(data);
    localStorage.setItem("token", res.data.token);
    persistUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    persistUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
