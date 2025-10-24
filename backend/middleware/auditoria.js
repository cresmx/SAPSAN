import sequelize from '../config/sequelize.js';

export const registrarAccion = async (usuarioId, accion, entidad, entidadId, payload, ip) => {
  try {
    await sequelize.query(
      `INSERT INTO acciones (usuario_sistema_id, accion, entidad, entidad_id, payload_json, ip)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      {
        bind: [
          usuarioId,
          accion,
          entidad,
          entidadId,
          payload ? JSON.stringify(payload) : null,
          ip
        ]
      }
    );
  } catch (error) {
    console.error('Error al registrar acción:', error);
  }
};

// Middleware genérico para usar en controladores
export const auditoriaMiddleware = (accion, entidad) => {
  return async (req, res, next) => {
    res.on('finish', async () => {
      if (res.statusCode < 400 && req.user) {
        await registrarAccion(
          req.user.id,
          accion,
          entidad,
          req.params.id || null,
          req.body || null,
          req.ip
        );
      }
    });
    next();
  };
};
