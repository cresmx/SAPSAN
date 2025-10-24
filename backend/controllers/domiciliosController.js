import sequelize from '../config/sequelize.js';

// Obtener todos los domicilios de un usuario
export const getDomiciliosByUser = async (req, res) => {
  try {
    const { id } = req.params; // usuario_id
    const [rows] = await sequelize.query(
      `SELECT d.*, m.id as medidor_id, m.numero_medidor, m.estado as estado_medidor
       FROM domicilios d
       LEFT JOIN medidores m ON d.id = m.domicilio_id AND m.estado = 'activo'
       WHERE d.usuario_id = $1 AND d.activo = true
       ORDER BY d.id`,
      { bind: [id] }
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al obtener domicilios:', error);
    res.status(500).json({ error: true, message: 'Error al obtener domicilios' });
  }
};

// Crear un domicilio para un usuario
export const createDomicilio = async (req, res) => {
  try {
    const { id } = req.params; // usuario_id
    const { manzana, calle, numero, referencia } = req.body;

    if (!manzana || !calle) {
      return res.status(400).json({ error: true, message: 'Faltan campos requeridos' });
    }

    const [rows] = await sequelize.query(
      `INSERT INTO domicilios (usuario_id, manzana, calle, numero, referencia, activo)
       VALUES ($1, $2, $3, $4, $5, true)
       RETURNING *`,
      { bind: [id, manzana, calle, numero, referencia] }
    );

    res.status(201).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error al crear domicilio:', error);
    res.status(500).json({ error: true, message: 'Error al crear domicilio' });
  }
};

// Actualizar domicilio
export const updateDomicilio = async (req, res) => {
  try {
    const { id } = req.params; // domicilio_id
    const { manzana, calle, numero, referencia, activo } = req.body;

    const [rows] = await sequelize.query(
      `UPDATE domicilios
       SET manzana = COALESCE($1, manzana),
           calle = COALESCE($2, calle),
           numero = COALESCE($3, numero),
           referencia = COALESCE($4, referencia),
           activo = COALESCE($5, activo)
       WHERE id = $6
       RETURNING *`,
      { bind: [manzana, calle, numero, referencia, activo, id] }
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: true, message: 'Domicilio no encontrado' });
    }

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error al actualizar domicilio:', error);
    res.status(500).json({ error: true, message: 'Error al actualizar domicilio' });
  }
};

// Eliminar (desactivar) domicilio
export const deleteDomicilio = async (req, res) => {
  try {
    const { id } = req.params; // domicilio_id

    const [rows] = await sequelize.query(
      `UPDATE domicilios SET activo = false WHERE id = $1 RETURNING *`,
      { bind: [id] }
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: true, message: 'Domicilio no encontrado' });
    }

    res.json({ success: true, message: 'Domicilio desactivado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar domicilio:', error);
    res.status(500).json({ error: true, message: 'Error al eliminar domicilio' });
  }
};
