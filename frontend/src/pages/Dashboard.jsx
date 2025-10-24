import React from "react";
import { Box, Card, CardContent, Typography, Button, Grid } from "@mui/material";
import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();

  const role = user?.role;

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Bienvenido, {user?.username} 👋
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Rol: {role}
      </Typography>

      <Grid container spacing={3}>
        {/* ADMIN */}
        {role === "admin" && (
          <>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Usuarios</Typography>
                  <Typography variant="body2" gutterBottom>
                    Gestiona usuarios del sistema
                  </Typography>
                  <Button component={Link} to="/usuarios" variant="contained">
                    Ir a Usuarios
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Domicilios</Typography>
                  <Typography variant="body2" gutterBottom>
                    Administra domicilios registrados
                  </Typography>
                  <Button component={Link} to="/domicilios" variant="contained">
                    Ir a Domicilios
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Medidores</Typography>
                  <Typography variant="body2" gutterBottom>
                    Controla medidores activos e inactivos
                  </Typography>
                  <Button component={Link} to="/medidores" variant="contained">
                    Ir a Medidores
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </>
        )}

        {/* CAJERO */}
        {role === "cajero" && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Caja</Typography>
                <Typography variant="body2" gutterBottom>
                  Consulta facturas y registra pagos
                </Typography>
                <Button component={Link} to="/caja" variant="contained">
                  Ir a Caja
                </Button>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* CAPTURISTA */}
        {role === "capturista" && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Captura de Mediciones</Typography>
                <Typography variant="body2" gutterBottom>
                  Registra lecturas de medidores
                </Typography>
                <Button component={Link} to="/captura" variant="contained">
                  Ir a Captura
                </Button>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* SUPERVISOR */}
        {role === "supervisor" && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Reportes</Typography>
                <Typography variant="body2" gutterBottom>
                  Visualiza métricas y morosidad
                </Typography>
                <Button component={Link} to="/reportes" variant="contained">
                  Ir a Reportes
                </Button>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
