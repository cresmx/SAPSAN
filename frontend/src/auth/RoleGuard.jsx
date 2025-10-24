// src/auth/RoleGuard.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { Alert, Box } from "@mui/material";

export default function RoleGuard({ roles = [], children }) {
  const { user } = useAuth();

  // Si no hay usuario autenticado → redirigir a login
  if (!user) return <Navigate to="/login" replace />;

  // Si el rol no está permitido → mostrar alerta
  if (!roles.includes(user?.role)) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning" variant="outlined">
          Acceso denegado: tu rol <strong>{user?.role}</strong> no tiene permisos
          para acceder a esta sección.
        </Alert>
      </Box>
    );
  }

  // Si pasa las validaciones → renderizar el contenido
  return children;
}
