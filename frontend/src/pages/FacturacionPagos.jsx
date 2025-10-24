import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client";

export default function FacturacionPagos() {
  const [numeroUsuario, setNumeroUsuario] = useState("");
  const [selectedFactura, setSelectedFactura] = useState(null);
  const [montoPago, setMontoPago] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  // Traer facturas de un usuario
  const { data: facturas, refetch, isFetching } = useQuery(
    ["facturas", numeroUsuario],
    async () => {
      if (!numeroUsuario) return [];
      const { data } = await api.get(`/facturas?numero_usuario=${numeroUsuario}`);
      return data.data;
    },
    { enabled: false }
  );

  // Mutación para registrar pago
  const registrarPago = useMutation({
    mutationFn: async ({ factura_id, monto }) => {
      const { data } = await api.post("/pagos", { factura_id, monto });
      return data.data;
    },
    onSuccess: () => {
      setSuccess("Pago registrado correctamente ✅");
      setError("");
      setMontoPago("");
      setSelectedFactura(null);
      queryClient.invalidateQueries(["facturas", numeroUsuario]);
    },
    onError: (err) => {
      setError(err.response?.data?.message || "Error al registrar pago");
      setSuccess("");
    },
  });

  const handleBuscar = () => {
    setSuccess("");
    setError("");
    refetch();
  };

  const handlePagar = () => {
    if (!montoPago || !selectedFactura) return;
    registrarPago.mutate({ factura_id: selectedFactura.id, monto: montoPago });
  };

  return (
    <Box p={3}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            💵 Caja – Facturación y Pagos
          </Typography>

          {success && <Alert severity="success">{success}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}

          {/* Buscar usuario */}
          <Box display="flex" gap={2} mt={2} mb={2}>
            <TextField
              label="Número de Usuario"
              value={numeroUsuario}
              onChange={(e) => setNumeroUsuario(e.target.value)}
            />
            <Button variant="contained" onClick={handleBuscar} disabled={isFetching}>
              {isFetching ? "Buscando..." : "Buscar"}
            </Button>
          </Box>

          {/* Tabla de facturas */}
          {facturas && facturas.length > 0 && (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Factura</TableCell>
                  <TableCell>Periodo</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Acción</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {facturas.map((f) => (
                  <TableRow key={f.id}>
                    <TableCell>{f.numero_factura}</TableCell>
                    <TableCell>{f.periodo}</TableCell>
                    <TableCell>${f.total}</TableCell>
                    <TableCell>{f.estado}</TableCell>
                    <TableCell>
                      {f.estado === "pendiente" && (
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() => setSelectedFactura(f)}
                        >
                          Registrar Pago
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal de pago */}
      <Dialog open={!!selectedFactura} onClose={() => setSelectedFactura(null)}>
        <DialogTitle>Registrar Pago</DialogTitle>
        <DialogContent>
          <Typography>
            Factura: {selectedFactura?.numero_factura} – Total: ${selectedFactura?.total}
          </Typography>
          <TextField
            label="Monto a pagar"
            type="number"
            fullWidth
            margin="normal"
            value={montoPago}
            onChange={(e) => setMontoPago(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedFactura(null)}>Cancelar</Button>
          <Button
            onClick={handlePagar}
            variant="contained"
            color="primary"
            disabled={registrarPago.isLoading}
          >
            {registrarPago.isLoading ? "Procesando..." : "Confirmar Pago"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
