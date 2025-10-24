// middleware/authMiddleware.js (versión ESM)
import jwt from 'jsonwebtoken';

/**
 * Middleware para verificar el token JWT
 */
export function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'No se proporcionó un token'
    });
  }

  // El formato esperado es: "Bearer <token>"
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Formato de token inválido'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Aquí tendrás { id, username, rol, ... }
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: 'Token inválido o expirado'
    });
  }
}
