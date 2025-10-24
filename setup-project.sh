#!/bin/bash

# Script de configuración para Sistema de Cobro de Agua Potable (PostgreSQL)
# Ejecutar desde la raíz del proyecto

echo "?? Iniciando configuración del proyecto..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ============================================
# BACKEND
# ============================================

echo -e "${GREEN}?? Configurando Backend...${NC}"

mkdir -p backend/services
mkdir -p backend/tests/unit
mkdir -p backend/tests/integration

# ============================================
# .env.example
# ============================================
cat > backend/.env.example << 'EOF'
# Server Configuration
PORT=3000
NODE_ENV=development

# PostgreSQL Database Configuration
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=tu_password
DB_NAME=agua_potable
DB_PORT=5432

# JWT Configuration
JWT_SECRET=tu_clave_secreta_super_segura_cambiar_en_produccion
JWT_EXPIRES_IN=24h

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
EOF
echo -e "${BLUE}? Creado: backend/.env.example${NC}"

# ============================================
# database.js
# ============================================
cat > backend/config/database.js << 'EOF'
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'agua_potable',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('connect', () => {
  console.log('? Conectado a PostgreSQL');
});

pool.on('error', (err) => {
  console.error('Error inesperado en PostgreSQL', err);
  process.exit(-1);
});

module.exports = pool;
EOF
echo -e "${BLUE}? Creado: backend/config/database.js${NC}"

# ============================================
# Modelo Usuario.js
# ============================================
cat > backend/models/Usuario.js << 'EOF'
const db = require('../config/database');

class Usuario {
  static async eliminar(id) {
    const query = 'DELETE FROM usuarios WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Usuario;
EOF
echo -e "${BLUE}? Creado: backend/models/Usuario.js${NC}"

# ============================================
# Modelo Medidor.js
# ============================================
cat > backend/models/Medidor.js << 'EOF'
const db = require('../config/database');

class Medidor {
  static async crear(datos) {
    const { numero_medidor, usuario_id, marca, modelo, fecha_instalacion, lectura_inicial } = datos;
    const query = `
      INSERT INTO medidores 
      (numero_medidor, usuario_id, marca, modelo, fecha_instalacion, lectura_inicial, estado)
      VALUES ($1, $2, $3, $4, $5, $6, 'activo')
      RETURNING *
    `;
    const values = [numero_medidor, usuario_id, marca, modelo, fecha_instalacion, lectura_inicial || 0];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async obtenerTodos(filtros = {}) {
    let query = `
      SELECT m.*, u.numero_usuario, u.nombres, u.apellidos, u.direccion
      FROM medidores m
      LEFT JOIN usuarios u ON m.usuario_id = u.id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (filtros.usuario_id) {
      query += \` AND m.usuario_id = $\${paramCount}\`;
      values.push(filtros.usuario_id);
      paramCount++;
    }

    if (filtros.estado) {
      query += \` AND m.estado = $\${paramCount}\`;
      values.push(filtros.estado);
      paramCount++;
    }

    query += ' ORDER BY m.numero_medidor';
    const result = await db.query(query, values);
    return result.rows;
  }

  static async obtenerPorId(id) {
    const query = \`
      SELECT m.*, u.numero_usuario, u.nombres, u.apellidos, u.direccion
      FROM medidores m
      LEFT JOIN usuarios u ON m.usuario_id = u.id
      WHERE m.id = $1
    \`;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async actualizar(id, datos) {
    const { marca, modelo, estado, usuario_id } = datos;
    const query = \`
      UPDATE medidores 
      SET marca = $1, modelo = $2, estado = $3, usuario_id = $4
      WHERE id = $5
      RETURNING *
    \`;
    const values = [marca, modelo, estado, usuario_id, id];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async eliminar(id) {
    const query = 'DELETE FROM medidores WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Medidor;
EOF
echo -e "${BLUE}? Creado: backend/models/Medidor.js${NC}"

# ============================================
# Modelo Medicion.js
# ============================================
cat > backend/models/Medicion.js << 'EOF'
const db = require('../config/database');

class Medicion {
  static async crear(datos) {
    const { medidor_id, lectura_anterior, lectura_actual, periodo, fecha_lectura, observaciones, leido_por } = datos;
    const query = \`
      INSERT INTO mediciones 
      (medidor_id, lectura_anterior, lectura_actual, periodo, fecha_lectura, observaciones, leido_por)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    \`;
    const values = [medidor_id, lectura_anterior, lectura_actual, periodo, fecha_lectura, observaciones, leido_por];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async obtenerPorId(id) {
    const query = \`
      SELECT m.*, med.numero_medidor, u.nombres, u.apellidos
      FROM mediciones m
      JOIN medidores med ON m.medidor_id = med.id
      JOIN usuarios u ON med.usuario_id = u.id
      WHERE m.id = $1
    \`;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async actualizar(id, datos) {
    const { lectura_actual, fecha_lectura, observaciones } = datos;
    const query = \`
      UPDATE mediciones 
      SET lectura_actual = $1, fecha_lectura = $2, observaciones = $3
      WHERE id = $4
      RETURNING *
    \`;
    const values = [lectura_actual, fecha_lectura, observaciones, id];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async eliminar(id) {
    const query = 'DELETE FROM mediciones WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Medicion;
EOF
echo -e "${BLUE}? Creado: backend/models/Medicion.js${NC}"

# ============================================
# Modelo Factura.js
# ============================================
cat > backend/models/Factura.js << 'EOF'
const db = require('../config/database');

class Factura {
  static async eliminar(id) {
    const query = 'DELETE FROM facturas WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Factura;
EOF
echo -e "${BLUE}? Creado: backend/models/Factura.js${NC}"

# ============================================
# index.js
# ============================================
cat > backend/models/index.js << 'EOF'
const Usuario = require('./Usuario');
const Medidor = require('./Medidor');
const Medicion = require('./Medicion');
const Factura = require('./Factura');

module.exports = { Usuario, Medidor, Medicion, Factura };
EOF
echo -e "${BLUE}? Creado: backend/models/index.js${NC}"

echo -e "${GREEN}? Backend configurado correctamente${NC}"

# ============================================
# FRONTEND
# ============================================

echo -e "${GREEN}?? Configurando Frontend...${NC}"

# Crear carpetas en frontend
mkdir -p frontend/src/components/layout
mkdir -p frontend/src/components/common
mkdir -p frontend/src/components/usuarios
mkdir -p frontend/src/components/medidores
mkdir -p frontend/src/components/mediciones
mkdir -p frontend/src/components/facturas
mkdir -p frontend/src/components/reportes
mkdir -p frontend/src/pages
mkdir -p frontend/src/context
mkdir -p frontend/src/hooks
mkdir -p frontend/src/services
mkdir -p frontend/src/utils
mkdir -p frontend/src/router

# .env para frontend
cat > frontend/.env << 'EOF'
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Sistema de Cobro de Agua Potable
EOF
echo -e "${BLUE}? Creado: frontend/.env${NC}"

# .gitignore para frontend
cat > frontend/.gitignore << 'EOF'
# Dependencies
node_modules/

# Environment variables
.env
.env.local
.env.production

# Build
dist/
dist-ssr/
*.local

# Editor
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Testing
coverage/
EOF
echo -e "${BLUE}? Creado: frontend/.gitignore${NC}"

# constants.js para frontend
cat > frontend/src/utils/constants.js << 'EOF'
export const ROLES = {
  ADMIN: 'admin',
  OPERADOR: 'operador',
  LECTOR: 'lector'
};

export const TIPOS_USUARIO = {
  DOMESTICO: 'domestico',
  COMERCIAL: 'comercial',
  INDUSTRIAL: 'industrial'
};

export const ESTADOS_FACTURA = {
  PENDIENTE: 'pendiente',
  PAGADA: 'pagada',
  VENCIDA: 'vencida',
  PARCIAL: 'parcial',
  CANCELADA: 'cancelada'
};

export const ESTADOS = {
  ACTIVO: 'activo',
  SUSPENDIDO: 'suspendido',
  INACTIVO: 'inactivo',
  BLOQUEADO: 'bloqueado'
};

export const METODOS_PAGO = {
  EFECTIVO: 'efectivo',
  TRANSFERENCIA: 'transferencia',
  TARJETA: 'tarjeta',
  CHEQUE: 'cheque'
};

export const RUTAS = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  USUARIOS: '/usuarios',
  MEDIDORES: '/medidores',
  MEDICIONES: '/mediciones',
  FACTURAS: '/facturas',
  REPORTES: '/reportes'
};

export const API_URL = import.meta.env.VITE_API_URL;
export const APP_NAME = import.meta.env.VITE_APP_NAME;
EOF
echo -e "${BLUE}? Creado: frontend/src/utils/constants.js${NC}"

# formatters.js
cat > frontend/src/utils/formatters.js << 'EOF'
// Funciones de formateo

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(amount);
};

export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatShortDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('es-MX');
};

export const formatDateForInput = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

export const formatNumber = (number, decimals = 2) => {
  return Number(number).toFixed(decimals);
};

export const formatPeriodo = (periodo) => {
  if (!periodo) return '';
  const [year, month] = periodo.split('-');
  const fecha = new Date(year, parseInt(month) - 1);
  return fecha.toLocaleDateString('es-MX', { year: 'numeric', month: 'long' });
};

export const getEstadoColor = (estado) => {
  const colores = {
    pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    pagada: 'bg-green-100 text-green-800 border-green-300',
    vencida: 'bg-red-100 text-red-800 border-red-300',
    parcial: 'bg-blue-100 text-blue-800 border-blue-300',
    cancelada: 'bg-gray-100 text-gray-800 border-gray-300'
  };
  return colores[estado] || 'bg-gray-100 text-gray-800 border-gray-300';
};

export const getTipoUsuarioColor = (tipo) => {
  const colores = {
    domestico: 'bg-blue-100 text-blue-800',
    comercial: 'bg-purple-100 text-purple-800',
    industrial: 'bg-orange-100 text-orange-800'
  };
  return colores[tipo] || 'bg-gray-100 text-gray-800';
};

export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
EOF
echo -e "${BLUE}? Creado: frontend/src/utils/formatters.js${NC}"

# validators.js
cat > frontend/src/utils/validators.js << 'EOF'
// Funciones de validación

export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const isValidPhone = (phone) => {
  const regex = /^\d{10}$/;
  return regex.test(phone.replace(/\s|-/g, ''));
};

export const isValidPeriodo = (periodo) => {
  const regex = /^\d{4}-(0[1-9]|1[0-2])$/;
  return regex.test(periodo);
};

export const isPositiveNumber = (num) => {
  return !isNaN(num) && parseFloat(num) > 0;
};

export const minLength = (str, min) => {
  return str && str.length >= min;
};

export const validateRequired = (fields) => {
  const errors = {};
  Object.keys(fields).forEach(key => {
    if (!fields[key] || fields[key].toString().trim() === '') {
      errors[key] = 'Este campo es requerido';
    }
  });
  return errors;
};
EOF
echo -e "${BLUE}? Creado: frontend/src/utils/validators.js${NC}"

# api.js
cat > frontend/src/services/api.js << 'EOF'
import axios from 'axios';
import { API_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = \`Bearer \${token}\`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    error.message = error.response?.data?.message || error.message || 'Error en la petición';
    return Promise.reject(error);
  }
);

export default api;
EOF
echo -e "${BLUE}? Creado: frontend/src/services/api.js${NC}"

# authService.js
cat > frontend/src/services/authService.js << 'EOF'
import api from './api';

const authService = {
  async login(username, password) {
    const response = await api.post('/auth/login', { username, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  getToken() {
    return localStorage.getItem('token');
  },

  hasRole(role) {
    const user = this.getCurrentUser();
    return user?.rol === role;
  },

  isAdmin() {
    return this.hasRole('admin');
  }
};

export default authService;
EOF
echo -e "${BLUE}? Creado: frontend/src/services/authService.js${NC}"

# userService.js
cat > frontend/src/services/userService.js << 'EOF'
import api from './api';

const userService = {
  async getAll(filtros = {}) {
    const response = await api.get('/users', { params: filtros });
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  async create(userData) {
    const response = await api.post('/users', userData);
    return response.data;
  },

  async update(id, userData) {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  async search(query) {
    const response = await api.get('/users', { params: { search: query } });
    return response.data;
  }
};

export default userService;
EOF
echo -e "${BLUE}? Creado: frontend/src/services/userService.js${NC}"

# medicionService.js
cat > frontend/src/services/medicionService.js << 'EOF'
import api from './api';

const medicionService = {
  async getAll(filtros = {}) {
    const response = await api.get('/mediciones', { params: filtros });
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/mediciones/${id}`);
    return response.data;
  },

  async create(medicionData) {
    const response = await api.post('/mediciones', medicionData);
    return response.data;
  },

  async update(id, medicionData) {
    const response = await api.put(`/mediciones/${id}`, medicionData);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/mediciones/${id}`);
    return response.data;
  },

  async getUltimaPorMedidor(medidorId) {
    const response = await api.get(`/mediciones/ultima/${medidorId}`);
    return response.data;
  }
};

export default medicionService;
EOF
echo -e "${BLUE}? Creado: frontend/src/services/medicionService.js${NC}"

# facturaService.js
cat > frontend/src/services/facturaService.js << 'EOF'
import api from './api';

const facturaService = {
  async getAll(filtros = {}) {
    const response = await api.get('/facturas', { params: filtros });
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/facturas/${id}`);
    return response.data;
  },

  async create(facturaData) {
    const response = await api.post('/facturas', facturaData);
    return response.data;
  },

  async update(id, facturaData) {
    const response = await api.put(`/facturas/${id}`, facturaData);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/facturas/${id}`);
    return response.data;
  },

  async registrarPago(id, pagoData) {
    const response = await api.post(`/facturas/${id}/pagar`, pagoData);
    return response.data;
  },

  async getVencidas() {
    const response = await api.get('/facturas/vencidas');
    return response.data;
  },

  async getEstadisticas(periodo = null) {
    const response = await api.get('/facturas/estadisticas', { params: { periodo } });
    return response.data;
  }
};

export default facturaService;
EOF
echo -e "${BLUE}? Creado: frontend/src/services/facturaService.js${NC}"

# AuthContext.jsx
cat > frontend/src/context/AuthContext.jsx << 'EOF'
import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const data = await authService.login(username, password);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.rol === 'admin',
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};
EOF
echo -e "${BLUE}? Creado: frontend/src/context/AuthContext.jsx${NC}"

# useApi.js
cat > frontend/src/hooks/useApi.js << 'EOF'
import { useState, useCallback } from 'react';

export const useApi = (apiFunc) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...params) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunc(...params);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message || 'Error en la petición');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunc]);

  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  return { data, loading, error, execute, reset };
};
EOF
echo -e "${BLUE}? Creado: frontend/src/hooks/useApi.js${NC}"

echo -e "${GREEN}? Frontend configurado correctamente${NC}"
echo -e "${GREEN}?? Proyecto configurado con éxito${NC}"

