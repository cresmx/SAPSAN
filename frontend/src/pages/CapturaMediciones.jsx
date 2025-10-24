import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { api } from "../api/client";

export default function CapturaMediciones() {
  const [form, setForm] = useState({
    domicilio_id: "",
    lectura_actual: "",
    lat: "",
    lng: "",
    foto: null,
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Mutación para enviar medición
  const mutation = useMutation({
    mutationFn: async (formData) => {
      const res = await api.post("/mediciones", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      setSuccess("Medición registrada correctamente ✅");
      setError("");
      setForm({ domicilio_id: "", lectura_actual: "", lat: "", lng: "", foto: null });
    },
    onError: (err) => {
      setError(err.response?.data?.message || "Error al registrar medición");
      setSuccess("");
    },
  });

  // Capturar ubicación GPS
  const obtenerUbicacion = () => {
    if (!navigator.geolocation) {
      setError("Geolocalización no soportada en este navegador");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm({ ...form, lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => setError("No se pudo obtener ubicación")
    );
  };

  // Manejo de archivo
  const handleFile = (e) => {
    setForm({ ...form, foto: e.target.files[0] });
  };

  // Enviar formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== "") fd.append(key, value);
    });
    mutation.mutate(fd);
  };

  return (
    <Box p={3}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            ➕ Captura de Medición
          </Typography>

          {success && <Alert severity="success">{success}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              label="ID Domicilio"
              fullWidth
              margin="normal"
              value={form.domicilio_id}
              onChange={(e) => setForm({ ...form, domicilio_id: e.target.value })}
              required
            />
            <TextField
              label="Lectura Actual (m³)"
              type="number"
              fullWidth
              margin="normal"
              value={form.lectura_actual}
              onChange={(e) => setForm({ ...form, lectura_actual: e.target.value })}
              required
            />

            <Box display="flex" gap={2} mt={2}>
              <TextField
                label="Latitud"
                value={form.lat}
                fullWidth
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Longitud"
                value={form.lng}
                fullWidth
                InputProps={{ readOnly: true }}
              />
              <Button variant="outlined" onClick={obtenerUbicacion}>
                📍 Obtener GPS
              </Button>
            </Box>

            <Box mt={2}>
              <Button variant="outlined" component="label">
                📸 Subir Foto del Medidor
                <input type="file" hidden accept="image/*" onChange={handleFile} />
              </Button>
              {form.foto && <Typography>{form.foto.name}</Typography>}
            </Box>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3 }}
              disabled={mutation.isLoading}
            >
              {mutation.isLoading ? "Guardando..." : "Guardar Medición"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
