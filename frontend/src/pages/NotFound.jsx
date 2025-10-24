import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Alert, Button } from "@mui/material";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "70vh",
        gap: 2,
      }}
    >
      <Alert severity="error" variant="filled" sx={{ width: "100%", maxWidth: 500 }}>
        Página no encontrada. La ruta que intentas acceder no existe.
      </Alert>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/")}
      >
        Volver al Dashboard
      </Button>
    </Box>
  );
}
