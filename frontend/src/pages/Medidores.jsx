import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
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
  TextField,
  MenuItem,
  Alert,
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client";

export default function Medidores() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    numero_serie: "",
    domicilio_id: "",
    estado: "activo",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Traer medidores
  const { data: medidores, isLoading } = useQuery(["medidores"], async () => {
    const { data } = await api.get("/medidores");
    return data.data;
  });

  // Crear/editar medidor
  const mutation = useMutation({
    mutationFn: async (payload) => {
      if (editing) {
        const { data } = await api.put(`/medidores/${editing.id}`, payload);
        return data.data;
      } else {
        const { data } = await api.post("/medidores", payload);
        return data.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["medidores"]);
      setSuccess(editing ? "Medidor actualizado ✅" : "Medidor creado ✅");
      setError("");
      setOpen(false);
      setForm({ numero_serie: "", domicilio_id: "", estado: "activo" });
      setEditing(null);
    },
    onError: (err) => {
      setError(err.response?.data?.message || "Error al guardar medidor");
      setSuccess("");
    },
  });

  // Eliminar medidor
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/medidores/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["medidores"]);
      setSuccess("Medidor eliminado ✅");
    },
    onError: () => setError("Error al eliminar medidor"),
  });

  const handleOpen = (med = null) => {
    setEditing(med);
    if (med) {
      setForm({
        numero_serie: med.numero_serie,
        domicilio_id: med.domicilio_id,
        estado: med.estado,
      });
    } else {
      setForm({ numero_serie: "", domicilio_id: "", estado: "activo" });
    }
    setOpen(true);
  };

  const handleSubmit = () => {
    mutation.mutate(form);
  };

  return (
    <Box p={3}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            🔧 Gestión de Medidores
          </Typography>

          {success && <Alert severity="success">{success}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}

          <Button variant="contained" sx={{ mb: 2 }} onClick={() => handleOpen()}>
            ➕ Nuevo Medidor
          </Button>

          {isLoading ? (
            <Typography>Cargando...</Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Número Serie</TableCell>
                  <TableCell>Domicilio ID</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {medidores?.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>{m.numero_serie}</TableCell>
                    <TableCell>{m.domicilio_id}</TableCell>
                    <TableCell>{m.estado}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleOpen(m)}>Editar</Button>
                      <Button color="error" onClick={() => deleteMutation.mutate(m.id)}>
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal Crear/Editar */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editing ? "Editar Medidor" : "Nuevo Medidor"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Número de Serie"
            fullWidth
            margin="normal"
            value={form.numero_serie}
            onChange={(e) => setForm({ ...form, numero_serie: e.target.value })}
          />
          <TextField
            label="Domicilio ID"
            fullWidth
            margin="normal"
            value={form.domicilio_id}
            onChange={(e) => setForm({ ...form, domicilio_id: e.target.value })}
          />
          <TextField
            label="Estado"
            select
            fullWidth
            margin="normal"
            value={form.estado}
            onChange={(e) => setForm({ ...form, estado: e.target.value })}
          >
            <MenuItem value="activo">Activo</MenuItem>
            <MenuItem value="inactivo">Inactivo</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={mutation.isLoading}>
            {mutation.isLoading ? "Guardando..." : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
