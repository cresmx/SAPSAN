// src/auth/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/client";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { username, role }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");

    if (token && username && role) {
      setUser({ username, role });
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const { data } = await api.post("/auth/login", { username, password });

    // Guardar token y rol en localStorage
    localStorage.setItem("token", data.accessToken);
    localStorage.setItem("username", username);
    localStorage.setItem("role", data.rol);

    // Actualizar estado
    setUser({ username, role: data.rol });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
