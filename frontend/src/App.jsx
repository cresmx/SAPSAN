// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute";
import RoleGuard from "./auth/RoleGuard";
import AppLayout from "./layout/AppLayout";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Usuarios from "./pages/Usuarios";
import CapturaMediciones from "./pages/CapturaMediciones";
import FacturacionPagos from "./pages/FacturacionPagos";
import Reportes from "./pages/Reportes";
import NotFound from "./pages/NotFound";
import Domicilios from "./pages/Domicilios";
import Medidores from "./pages/Medidores";
import ErrorBoundary from "./components/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        {
      <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />

        <Route
          path="usuarios"
          element={
            <RoleGuard roles={["admin"]}>
              <Usuarios />
            </RoleGuard>
          }
        />

        <Route
          path="captura"
          element={
            <RoleGuard roles={["capturista", "admin"]}>
              <CapturaMediciones />
            </RoleGuard>
          }
        />

        <Route
          path="caja"
          element={
            <RoleGuard roles={["cajero", "admin"]}>
              <FacturacionPagos />
            </RoleGuard>
          }
        />

        <Route
          path="reportes"
          element={
            <RoleGuard roles={["supervisor", "admin"]}>
              <Reportes />
            </RoleGuard>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Route>

      <Route
  path="domicilios"
  element={
    <RoleGuard roles={["admin", "supervisor"]}>
      <Domicilios />
    </RoleGuard>
  }
/>

<Route
  path="medidores"
  element={
    <RoleGuard roles={["admin", "supervisor"]}>
      <Medidores />
    </RoleGuard>
  }
/>
    </Routes>
      
      }
      </Routes>
    </ErrorBoundary>
  );
}
