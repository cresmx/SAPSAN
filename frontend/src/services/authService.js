import api from "./api";

// Iniciar sesión
export const login = async (username, password) => {
  const res = await api.post("/auth/login", { username, password });
  // Guardamos token y usuario en localStorage
  localStorage.setItem("token", res.data.token);
  localStorage.setItem("user", JSON.stringify(res.data.user));
  return res.data;
};

// Cerrar sesión
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Obtener usuario actual
export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Obtener token actual
export const getToken = () => {
  return localStorage.getItem("token");
};
