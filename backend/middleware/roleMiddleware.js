// middleware/roleMiddleware.js (versión ESM)

// Si tienes constantes de roles en utils/constants.js, impórtalas
import { ROLES } from '../utils/constants.js';

/**
 * Middleware genérico para verificar si el usuario tiene un rol permitido
 */
export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'No autenticado'
      });
    }

    const userRole = req.user.rol;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para realizar esta acción',
        requiredRoles: allowedRoles,
        yourRole: userRole
      });
    }

    next();
  };
}

/**
 * Middleware para verificar si es admin
 */
export const isAdmin = authorize(ROLES.ADMIN);

/**
 * Middleware para verificar si es admin u operador
 */
export const isAdminOrOperador = authorize(ROLES.ADMIN, ROLES.OPERADOR);

/**
 * Middleware para cualquier usuario autenticado
 */
export function isAuthenticated(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Debes iniciar sesión para acceder a este recurso'
    });
  }
  next();
}
