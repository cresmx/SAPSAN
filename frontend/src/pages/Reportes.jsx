import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Reportes() {
  // Dashboard general
  const { data: dashboard, isLoading: loadingDashboard } = useQuery(
    ["reportes-dashboard"],
    async () => {
      const { data } = await api.get("/reportes/dashboard");
      return data.data;
    }
  );

  // Consumos por periodo
  const { data: consumos, isLoading: loadingConsumos } = useQuery(
    ["reportes-consumos"],
    async () => {
      const { data } = await api.get("/reportes/consumos");
      return data.data;
    }
  );

  // Morosidad (usuarios con facturas pendientes)
  const { data: morosos, isLoading: loadingMorosos } = useQuery(
    ["reportes-morosidad"],
    async () => {
      const { data } = await api.get("/reportes/morosidad");
      return data.data;
    }
  );

  if (loadingDashboard || loadingConsumos || loadingMorosos) {
    return (
      <Box p={3} textAlign="center">
        <CircularProgress />
        <Typography>Cargando reportes...</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        📊 Reportes del Sistema
      </Typography>

      {/* Métricas generales */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6">Métricas Generales</Typography>
          <Box display="flex" gap={4} mt={2}>
            <Typography>Usuarios Activos: {dashboard.usuarios_activos}</Typography>
            <Typography>Consumo Total: {dashboard.consumo_total_m3} m³</Typography>
            <Typography>Facturas Emitidas: {dashboard.facturas_emitidas}</Typography>
            <Typography>Pagos Registrados: {dashboard.pagos_registrados}</Typography>
            <Typography>Monto Facturado: ${dashboard.monto_facturado}</Typography>
            <Typography>Monto Pendiente: ${dashboard.monto_pendiente}</Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Gráfica de consumos */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6">📈 Consumo por Periodo</Typography>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={consumos}>
              <XAxis dataKey="periodo" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total_consumo" fill="#1976d2" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tabla de morosidad */}
      <Card>
        <CardContent>
          <Typography variant="h6">⚠️ Reporte de Morosidad</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Usuario</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Periodo</TableCell>
                <TableCell>Monto Pendiente</TableCell>
                <TableCell>Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {morosos?.map((m, idx) => (
                <TableRow key={idx}>
                  <TableCell>{m.numero_usuario}</TableCell>
                  <TableCell>{m.nombre_completo}</TableCell>
                  <TableCell>{m.periodo}</TableCell>
                  <TableCell>${m.monto_pendiente}</TableCell>
                  <TableCell>{m.estado}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Box>
  );
}
