// utils/constants.js (versión ESM)

// Roles de usuario del sistema
export const ROLES = {
  ADMIN: 'admin',
  OPERADOR: 'operador',
  LECTOR: 'lector'
};

// Tipos de usuario del servicio
export const TIPOS_USUARIO = {
  DOMESTICO: 'domestico',
  COMERCIAL: 'comercial',
  INDUSTRIAL: 'industrial'
};

// Estados de factura
export const ESTADOS_FACTURA = {
  PENDIENTE: 'pendiente',
  PAGADA: 'pagada',
  VENCIDA: 'vencida',
  PARCIAL: 'parcial',
  CANCELADA: 'cancelada'
};

// Estados de usuario/medidor
export const ESTADOS = {
  ACTIVO: 'activo',
  SUSPENDIDO: 'suspendido',
  INACTIVO: 'inactivo',
  BLOQUEADO: 'bloqueado'
};

// Métodos de pago
export const METODOS_PAGO = {
  EFECTIVO: 'efectivo',
  TRANSFERENCIA: 'transferencia',
  TARJETA: 'tarjeta',
  CHEQUE: 'cheque'
};

// Configuración de tarifas por defecto
export const TARIFAS_DEFAULT = {
  DOMESTICO: {
    BASE: 50,
    POR_M3: 5,
    MINIMO: 10
  },
  COMERCIAL: {
    BASE: 100,
    POR_M3: 8,
    MINIMO: 15
  },
  INDUSTRIAL: {
    BASE: 200,
    POR_M3: 12,
    MINIMO: 20
  }
};
