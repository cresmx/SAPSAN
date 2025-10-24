import sequelize from '../config/sequelize.js';

// Registrar un pago
export const createPago = async (req, res) => {
  try {
    const { factura_id, monto, metodo_pago, numero_referencia, fecha_pago, observaciones } = req.body;

    if (!factura_id || !monto || !metodo_pago) {
      return res.status(400).json({ error: true, message: 'Faltan campos requeridos' });
    }

    // Verificar que la factura exista y esté pendiente
    const [factura] = await sequelize.query(
      `SELECT * FROM facturas WHERE id = $1 AND estado = 'pendiente'`,
      { bind: [factura_id] }
    );

    if (factura.length === 0) {
      return res.status(400).json({ error: true, message: 'Factura no encontrada o ya pagada' });
    }

    // Insertar pago
    const [rows] = await sequelize.query(
      `INSERT INTO pagos (factura_id, monto, metodo_pago, numero_referencia, fecha_pago, recibido_por, observaciones)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING *`,
      {
        bind: [
          factura_id,
          monto,
          metodo_pago,
          numero_referencia || null,
          fecha_pago || new Date(),
          req.user?.id || null,
          observaciones || null
        ]
      }
    );

    // Actualizar estado de factura
    await sequelize.query(
      `UPDATE facturas SET estado = 'pagada', updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
      { bind: [factura_id] }
    );

    res.status(201).json({ success: true, message: 'Pago registrado exitosamente', data: rows[0] });
  } catch (error) {
    console.error('Error al registrar pago:', error);
    res.status(500).json({ error: true, message: 'Error al registrar pago' });
  }
};

// Consultar pagos por factura
export const getPagosByFactura = async (req, res) => {
  try {
    const { factura_id } = req.params;

    const [rows] = await sequelize.query(
      `SELECT p.*, u.nombre_completo as cajero
       FROM pagos p
       LEFT JOIN usuarios_sistema u ON p.recibido_por = u.id
       WHERE factura_id = $1
       ORDER BY fecha_pago DESC`,
      { bind: [factura_id] }
    );

    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al obtener pagos:', error);
    res.status(500).json({ error: true, message: 'Error al obtener pagos' });
  }
};

// Consultar pagos por periodo
export const getPagosByPeriodo = async (req, res) => {
  try {
    const { periodo } = req.query; // YYYY-MM
    if (!periodo) {
      return res.status(400).json({ error: true, message: 'Periodo requerido (YYYY-MM)' });
    }

    const [rows] = await sequelize.query(
      `SELECT p.*, f.numero_factura, u.nombres, u.apellidos, d.manzana
       FROM pagos p
       JOIN facturas f ON p.factura_id = f.id
       JOIN usuarios u ON f.usuario_id = u.id
       JOIN domicilios d ON f.domicilio_id = d.id
       WHERE to_char(p.fecha_pago, 'YYYY-MM') = $1
       ORDER BY p.fecha_pago DESC`,
      { bind: [periodo] }
    );

    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al obtener pagos por periodo:', error);
    res.status(500).json({ error: true, message: 'Error al obtener pagos' });
  }
};
