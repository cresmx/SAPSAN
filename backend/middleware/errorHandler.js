// Middleware de manejo de errores

const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err);

  // Error de validación de express-validator
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: err.errors
    });
  }

  // Error de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expirado'
    });
  }

  // Error de PostgreSQL - unique constraint
  if (err.code === '23505') {
    return res.status(409).json({
      success: false,
      message: 'El registro ya existe (valor duplicado)'
    });
  }

  // Error de PostgreSQL - foreign key constraint
  if (err.code === '23503') {
    return res.status(400).json({
      success: false,
      message: 'Referencia inválida: el registro relacionado no existe'
    });
  }

  // Error de PostgreSQL - not null constraint
  if (err.code === '23502') {
    return res.status(400).json({
      success: false,
      message: 'Campo requerido faltante'
    });
  }

  // Error genérico
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      code: err.code 
    })
  });
};

// Middleware para rutas no encontradas
const notFound = (req, res, next) => {
  const error = new Error(`Ruta no encontrada - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = { errorHandler, notFound };
