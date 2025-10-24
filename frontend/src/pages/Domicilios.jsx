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
  Alert,
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client";

export default function Domicilios() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    numero_usuario: "",
    direccion: "",
    propietario: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Traer domicilios
  const { data: domicilios, isLoading } = useQuery(["domicilios"], async () => {
    const { data } = await api.get("/domicilios");
    return data.data;
  });

  // Crear/editar domicilio
  const mutation = useMutation({
    mutationFn: async (payload) => {
      if (editing) {
        const { data } = await api.put(`/domicilios/${editing.id}`, payload);
        return data.data;
      } else {
        const { data } = await api.post("/domicilios", payload);
        return data.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["domicilios"]);
      setSuccess(editing ? "Domicilio actualizado ✅" : "Domicilio creado ✅");
      setError("");
      setOpen(false);
      setForm({ numero_usuario: "", direccion: "", propietario: "" });
      setEditing(null);
    },
    onError: (err) => {
      setError(err.response?.data?.message || "Error al guardar domicilio");
      setSuccess("");
    },
  });

  // Eliminar domicilio
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/domicilios/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["domicilios"]);
      setSuccess("Domicilio eliminado ✅");
    },
    onError: () => setError("Error al eliminar domicilio"),
  });

  const handleOpen = (dom = null) => {
    setEditing(dom);
    if (dom) {
      setForm({
        numero_usuario: dom.numero_usuario,
        direccion: dom.direccion,
        propietario: dom.propietario,
      });
    } else {
      setForm({ numero_usuario: "", direccion: "", propietario: "" });
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
            🏠 Gestión de Domicilios
          </Typography>

          {success && <Alert severity="success">{success}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}

          <Button variant="contained" sx={{ mb: 2 }} onClick={() => handleOpen()}>
            ➕ Nuevo Domicilio
          </Button>

          {isLoading ? (
            <Typography>Cargando...</Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Número Usuario</TableCell>
                  <TableCell>Dirección</TableCell>
                  <TableCell>Propietario</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {domicilios?.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell>{d.numero_usuario}</TableCell>
                    <TableCell>{d.direccion}</TableCell>
                    <TableCell>{d.propietario}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleOpen(d)}>Editar</Button>
                      <Button color="error" onClick={() => deleteMutation.mutate(d.id)}>
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
        <DialogTitle>{editing ? "Editar Domicilio" : "Nuevo Domicilio"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Número Usuario"
            fullWidth
            margin="normal"
            value={form.numero_usuario}
            onChange={(e) => setForm({ ...form, numero_usuario: e.target.value })}
          />
          <TextField
            label="Dirección"
            fullWidth
            margin="normal"
            value={form.direccion}
            onChange={(e) => setForm({ ...form, direccion: e.target.value })}
          />
          <TextField
            label="Propietario"
            fullWidth
            margin="normal"
            value={form.propietario}
            onChange={(e) => setForm({ ...form, propietario: e.target.value })}
          />
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
