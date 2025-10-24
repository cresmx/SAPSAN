import sequelize from '../config/sequelize.js';

// Obtener medidor de un domicilio
export const getMedidorByDomicilio = async (req, res) => {
  try {
    const { id } = req.params; // domicilio_id
    const [rows] = await sequelize.query(
      `SELECT * FROM medidores WHERE domicilio_id = $1 AND estado = 'activo'`,
      { bind: [id] }
    );

    if (rows.length === 0) {
      return res.json({ success: true, data: null });
    }

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error al obtener medidor:', error);
    res.status(500).json({ error: true, message: 'Error al obtener medidor' });
  }
};

// Asignar un medidor a un domicilio
export const createMedidor = async (req, res) => {
  try {
    const { id } = req.params; // domicilio_id
    const { numero_medidor, marca, modelo, fecha_instalacion, lectura_inicial } = req.body;

    if (!numero_medidor) {
      return res.status(400).json({ error: true, message: 'Número de medidor requerido' });
    }

    // Verificar duplicado
    const [existing] = await sequelize.query(
      'SELECT id FROM medidores WHERE numero_medidor = $1 AND estado = $2',
      { bind: [numero_medidor, 'activo'] }
    );
    if (existing.length > 0) {
      return res.status(400).json({ error: true, message: 'El número de medidor ya existe' });
    }

    const [rows] = await sequelize.query(
      `INSERT INTO medidores (numero_medidor, domicilio_id, marca, modelo, fecha_instalacion, lectura_inicial, estado)
       VALUES ($1, $2, $3, $4, $5, $6, 'activo')
       RETURNING *`,
      { bind: [numero_medidor, id, marca || null, modelo || null, fecha_instalacion || new Date(), lectura_inicial || 0] }
    );

    res.status(201).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error al crear medidor:', error);
    res.status(500).json({ error: true, message: 'Error al crear medidor' });
  }
};

// Actualizar medidor
export const updateMedidor = async (req, res) => {
  try {
    const { id } = req.params; // medidor_id
    const { numero_medidor, marca, modelo, estado } = req.body;

    const [rows] = await sequelize.query(
      `UPDATE medidores
       SET numero_medidor = COALESCE($1, numero_medidor),
           marca = COALESCE($2, marca),
           modelo = COALESCE($3, modelo),
           estado = COALESCE($4, estado),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
      { bind: [numero_medidor, marca, modelo, estado, id] }
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: true, message: 'Medidor no encontrado' });
    }

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error al actualizar medidor:', error);
    res.status(500).json({ error: true, message: 'Error al actualizar medidor' });
  }
};

// Eliminar (desactivar) medidor
export const deleteMedidor = async (req, res) => {
  try {
    const { id } = req.params; // medidor_id

    const [rows] = await sequelize.query(
      `UPDATE medidores SET estado = 'inactivo', updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
      { bind: [id] }
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: true, message: 'Medidor no encontrado' });
    }

    res.json({ success: true, message: 'Medidor desactivado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar medidor:', error);
    res.status(500).json({ error: true, message: 'Error al eliminar medidor' });
  }
};
