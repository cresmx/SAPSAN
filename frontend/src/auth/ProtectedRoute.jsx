// src/auth/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;            // puedes mostrar un spinner global
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
