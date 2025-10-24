import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const drawerWidth = 240;

export default function AppLayout() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const toggleDrawer = () => setMobileOpen(!mobileOpen);

  const menuItems = [
    { label: "Dashboard", path: "/", roles: ["admin", "cajero", "capturista", "supervisor"] },
    { label: "Usuarios", path: "/usuarios", roles: ["admin"] },
    { label: "Domicilios", path: "/domicilios", roles: ["admin"] },
    { label: "Medidores", path: "/medidores", roles: ["admin"] },
    { label: "Captura", path: "/captura", roles: ["capturista", "admin"] },
    { label: "Caja", path: "/caja", roles: ["cajero", "admin"] },
    { label: "Reportes", path: "/reportes", roles: ["supervisor", "admin"] },
  ];

  const drawer = (
    <Box sx={{ width: drawerWidth }}>
      <Typography variant="h6" sx={{ p: 2 }}>
        💧 Agua Potable
      </Typography>
      <Divider />
      <List>
        {menuItems
          .filter((item) => item.roles.includes(user?.role))
          .map((item) => (
            <ListItem
              button
              key={item.path}
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              onClick={() => setMobileOpen(false)}
            >
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        <Divider />
        <ListItem
  button
  onClick={() => {
    if (window.confirm("¿Seguro que deseas cerrar sesión?")) {
      logout();
    }
  }}
>
  <ListItemText primary="Salir" />
</ListItem>

      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* AppBar superior */}
      <AppBar position="fixed" sx={{ zIndex: 1201 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            Bienvenido, {user?.username} ({user?.role})
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Drawer lateral */}
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={toggleDrawer}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Contenido principal */}
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar /> {/* espacio para AppBar */}
        <Outlet />
      </Box>
    </Box>
  );
}
