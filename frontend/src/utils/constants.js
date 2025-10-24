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
