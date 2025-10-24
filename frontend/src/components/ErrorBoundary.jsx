import React from "react";
import { Alert, Box, Button } from "@mui/material";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Actualiza el estado para mostrar la UI alternativa
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Aquí puedes enviar el error a un servicio de logging si lo deseas
    console.error("Error capturado por ErrorBoundary:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
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
          <Alert severity="error" variant="filled" sx={{ maxWidth: 600 }}>
            Ocurrió un error inesperado en la aplicación.
          </Alert>
          <Button variant="contained" color="primary" onClick={this.handleReload}>
            Recargar página
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}
