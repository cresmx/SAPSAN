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

export default function Usuarios() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({ username: "", role: "cajero", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Traer usuarios
  const { data: usuarios, isLoading } = useQuery(["usuarios"], async () => {
    const { data } = await api.get("/users");
    return data.data;
  });

  // Crear/editar usuario
  const mutation = useMutation({
    mutationFn: async (payload) => {
      if (editingUser) {
        const { data } = await api.put(`/users/${editingUser.id}`, payload);
        return data.data;
      } else {
        const { data } = await api.post("/users", payload);
        return data.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["usuarios"]);
      setSuccess(editingUser ? "Usuario actualizado ✅" : "Usuario creado ✅");
      setError("");
      setOpen(false);
      setForm({ username: "", role: "cajero", password: "" });
      setEditingUser(null);
    },
    onError: (err) => {
      setError(err.response?.data?.message || "Error al guardar usuario");
      setSuccess("");
    },
  });

  // Eliminar usuario
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["usuarios"]);
      setSuccess("Usuario eliminado ✅");
    },
    onError: () => setError("Error al eliminar usuario"),
  });

  const handleOpen = (user = null) => {
    setEditingUser(user);
    if (user) {
      setForm({ username: user.username, role: user.role, password: "" });
    } else {
      setForm({ username: "", role: "cajero", password: "" });
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
            👥 Gestión de Usuarios
          </Typography>

          {success && <Alert severity="success">{success}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}

          <Button variant="contained" sx={{ mb: 2 }} onClick={() => handleOpen()}>
            ➕ Nuevo Usuario
          </Button>

          {isLoading ? (
            <Typography>Cargando...</Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Usuario</TableCell>
                  <TableCell>Rol</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usuarios?.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>{u.username}</TableCell>
                    <TableCell>{u.role}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleOpen(u)}>Editar</Button>
                      <Button color="error" onClick={() => deleteMutation.mutate(u.id)}>
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
        <DialogTitle>{editingUser ? "Editar Usuario" : "Nuevo Usuario"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Usuario"
            fullWidth
            margin="normal"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <TextField
            label="Rol"
            select
            fullWidth
            margin="normal"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="cajero">Cajero</MenuItem>
            <MenuItem value="capturista">Capturista</MenuItem>
            <MenuItem value="supervisor">Supervisor</MenuItem>
          </TextField>
          {!editingUser && (
            <TextField
              label="Contraseña"
              type="password"
              fullWidth
              margin="normal"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          )}
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
