import sequelize from '../config/sequelize.js';

// @desc    Obtener todos los usuarios
// @route   GET /api/users
// @access  Private
export const getUsers = async (req, res) => {
  try {
    const { search, estado, tipo, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let whereConditions = [];
    let params = [];
    let paramCount = 1;

    if (search) {
      whereConditions.push(
        `(numero_usuario ILIKE $${paramCount} OR nombres ILIKE $${paramCount} OR apellidos ILIKE $${paramCount})`
      );
      params.push(`%${search}%`);
      paramCount++;
    }

    if (estado) {
      whereConditions.push(`estado = $${paramCount}`);
      params.push(estado);
      paramCount++;
    }

    if (tipo) {
      whereConditions.push(`tipo_usuario = $${paramCount}`);
      params.push(tipo);
      paramCount++;
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Contar total
    const [countResult] = await sequelize.query(
      `SELECT COUNT(*) FROM usuarios ${whereClause}`,
      { bind: params }
    );
    const total = parseInt(countResult[0].count);

    // Obtener usuarios
    const [rows] = await sequelize.query(
      `SELECT u.*, 
              m.numero_medidor,
              (SELECT COUNT(*) FROM facturas WHERE usuario_id = u.id AND estado = 'pendiente') as facturas_pendientes
       FROM usuarios u
       LEFT JOIN medidores m ON u.id = m.usuario_id AND m.estado = 'activo'
       ${whereClause}
       ORDER BY u.numero_usuario
       LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
      { bind: [...params, limit, offset] }
    );

    res.json({
      success: true,
      data: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: true, message: 'Error al obtener usuarios' });
  }
};

// @desc    Obtener un usuario por ID
// @route   GET /api/users/:id
// @access  Private
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await sequelize.query(
      `SELECT u.*, 
              m.id as medidor_id, m.numero_medidor, m.marca, m.modelo, 
              m.fecha_instalacion, m.lectura_inicial
       FROM usuarios u
       LEFT JOIN medidores m ON u.id = m.usuario_id AND m.estado = 'activo'
       WHERE u.id = $1`,
      { bind: [id] }
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: true, message: 'Usuario no encontrado' });
    }

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ error: true, message: 'Error al obtener usuario' });
  }
};

// @desc    Crear nuevo usuario
// @route   POST /api/users
// @access  Private (Admin)
export const createUser = async (req, res) => {
  try {
    const {
      numero_usuario,
      nombres,
      apellidos,
      direccion,
      telefono,
      email,
      tipo_usuario,
      medidor
    } = req.body;

    if (!numero_usuario || !nombres || !apellidos || !direccion) {
      return res.status(400).json({ error: true, message: 'Faltan campos requeridos' });
    }

    const [existingUser] = await sequelize.query(
      'SELECT id FROM usuarios WHERE numero_usuario = $1',
      { bind: [numero_usuario] }
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ error: true, message: 'El número de usuario ya existe' });
    }

    const [rows] = await sequelize.query(
      `INSERT INTO usuarios (numero_usuario, nombres, apellidos, direccion, telefono, email, tipo_usuario)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      { bind: [numero_usuario, nombres, apellidos, direccion, telefono, email, tipo_usuario || 'domestico'] }
    );

    const usuario = rows[0];

    if (medidor && medidor.numero_medidor) {
      await sequelize.query(
        `INSERT INTO medidores (numero_medidor, usuario_id, marca, modelo, fecha_instalacion, lectura_inicial, estado)
         VALUES ($1, $2, $3, $4, $5, $6, 'activo')`,
        {
          bind: [
            medidor.numero_medidor,
            usuario.id,
            medidor.marca || null,
            medidor.modelo || null,
            medidor.fecha_instalacion || new Date(),
            medidor.lectura_inicial || 0
          ]
        }
      );
    }

    res.status(201).json({ success: true, message: 'Usuario creado exitosamente', data: usuario });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ error: true, message: 'Error al crear usuario' });
  }
};

// @desc    Actualizar usuario
// @route   PUT /api/users/:id
// @access  Private (Admin)
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { numero_usuario, nombres, apellidos, direccion, telefono, email, tipo_usuario, estado } = req.body;

    const [existingUser] = await sequelize.query('SELECT id FROM usuarios WHERE id = $1', { bind: [id] });

    if (existingUser.length === 0) {
      return res.status(404).json({ error: true, message: 'Usuario no encontrado' });
    }

    if (numero_usuario) {
      const [duplicateCheck] = await sequelize.query(
        'SELECT id FROM usuarios WHERE numero_usuario = $1 AND id != $2',
        { bind: [numero_usuario, id] }
      );
      if (duplicateCheck.length > 0) {
        return res.status(400).json({ error: true, message: 'El número de usuario ya existe' });
      }
    }

    const [rows] = await sequelize.query(
      `UPDATE usuarios 
       SET numero_usuario = COALESCE($1, numero_usuario),
           nombres = COALESCE($2, nombres),
           apellidos = COALESCE($3, apellidos),
           direccion = COALESCE($4, direccion),
           telefono = COALESCE($5, telefono),
           email = COALESCE($6, email),
           tipo_usuario = COALESCE($7, tipo_usuario),
           estado = COALESCE($8, estado),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
      { bind: [numero_usuario, nombres, apellidos, direccion, telefono, email, tipo_usuario, estado, id] }
    );

    res.json({ success: true, message: 'Usuario actualizado exitosamente', data: rows[0] });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ error: true, message: 'Error al actualizar usuario' });
  }
};

// @desc    Eliminar usuario (desactivar)
// @route   DELETE /api/users/:id
// @access  Private (Admin)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const [pendingInvoices] = await sequelize.query(
      'SELECT COUNT(*) FROM facturas WHERE usuario_id = $1 AND estado = $2',
      { bind: [id, 'pendiente'] }
    );

    if (parseInt(pendingInvoices[0].count) > 0) {
      return res.status(400).json({
        error: true,
        message: 'No se puede eliminar el usuario porque tiene facturas pendientes'
      });
    }

    const [rows] = await sequelize.query(
      'UPDATE usuarios SET estado = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      { bind: ['inactivo', id] }
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: true, message: 'Usuario no encontrado' });
    }

    res.json({ success: true, message: 'Usuario desactivado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ error: true, message: 'Error al eliminar usuario' });
  }
};

// @desc    Obtener historial de consumo de un usuario
// @route   GET /api/users/:id/historial
// @access  Private
export const getUserHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 12 } = req.query;

    const [rows] = await sequelize.query(
      `SELECT m.*, f.numero_factura, f.total as monto_facturado, f.estado as estado_factura
       FROM mediciones m
       JOIN medidores med ON m.medidor_id = med.id
       LEFT JOIN facturas f ON m.id = f.medicion_id
       WHERE med.usuario_id = $1
       ORDER BY m.fecha_lectura DESC
       LIMIT $2`,
      { bind: [id, limit] }
    );

    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al obtener historial:', error);
    res.status(500).json({ error: true, message: 'Error al obtener historial' });
  }
};
