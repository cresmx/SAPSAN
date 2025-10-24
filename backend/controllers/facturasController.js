import sequelize from '../config/sequelize.js';

// @desc    Generar facturas para un periodo
// @route   POST /api/facturas/generar?periodo=YYYY-MM
// @access  Private (Admin)
export const generarFacturas = async (req, res) => {
  const { periodo } = req.query; // formato YYYY-MM
  if (!periodo) {
    return res.status(400).json({ error: true, message: 'Periodo requerido (YYYY-MM)' });
  }

  try {
    // Obtener todos los domicilios activos con su medidor
    const [domicilios] = await sequelize.query(
      `SELECT d.id AS domicilio_id,
              d.usuario_id,
              d.manzana,
              m.id AS medidor_id
       FROM domicilios d
       LEFT JOIN medidores m ON d.id = m.domicilio_id AND m.estado = 'activo'
       WHERE d.activo = true`
    );

    let facturasGeneradas = [];

    for (const dom of domicilios) {
      let consumo = 0;
      let total = 0;
      let monto_base = 50;
      let excedente = 0;
      let monto_excedente = 0;
      let medicionId = null;

      if (dom.medidor_id) {
        // Buscar medición del periodo por medidor_id
        const [med] = await sequelize.query(
          `SELECT id, lectura_anterior, lectura_actual
           FROM mediciones
           WHERE medidor_id = $1 AND periodo = $2
           ORDER BY fecha_lectura DESC LIMIT 1`,
          { bind: [dom.medidor_id, periodo] }
        );

        if (med.length > 0) {
          consumo = med[0].lectura_actual - med[0].lectura_anterior;
          excedente = consumo > 15 ? consumo - 15 : 0;
          monto_excedente = excedente * 6;
          total = monto_base + monto_excedente;
          medicionId = med[0].id;
        } else {
          total = monto_base;
        }
      } else {
        total = monto_base;
      }

      // Log de depuración
      console.log(
        `Generando factura -> Usuario: ${dom.usuario_id}, Domicilio: ${dom.domicilio_id}, Medidor: ${dom.medidor_id}, Medición: ${medicionId}, Consumo: ${consumo}, Total: ${total}`
      );

      // Insertar factura con medicion_id (puede ser null si no hubo medición)
      const [factura] = await sequelize.query(
        `INSERT INTO facturas (usuario_id, domicilio_id, medicion_id, numero_factura, periodo, consumo, monto_consumo, monto_fijo, total, estado, fecha_emision, fecha_vencimiento)
         VALUES ($1,$2,$3,concat('FAC-', nextval('facturas_id_seq')),$4,$5,$6,$7,$8,'pendiente',CURRENT_DATE,CURRENT_DATE + interval '15 days')
         RETURNING *`,
        { bind: [dom.usuario_id, dom.domicilio_id, medicionId, periodo, consumo, monto_excedente, monto_base, total] }
      );

      facturasGeneradas.push(factura[0]);
    }

    res.json({ success: true, count: facturasGeneradas.length, data: facturasGeneradas });
  } catch (error) {
    console.error('Error al generar facturas:', error);
    res.status(500).json({ error: true, message: 'Error al generar facturas' });
  }
};

// @desc    Consultar facturas
// @route   GET /api/facturas
// @access  Private
export const getFacturas = async (req, res) => {
  try {
    const { periodo, estado, usuario_id } = req.query;
    let conditions = [];
    let params = [];
    let i = 1;

    if (periodo) {
      conditions.push(`periodo = $${i++}`);
      params.push(periodo);
    }
    if (estado) {
      conditions.push(`estado = $${i++}`);
      params.push(estado);
    }
    if (usuario_id) {
      conditions.push(`usuario_id = $${i++}`);
      params.push(usuario_id);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const [rows] = await sequelize.query(
      `SELECT f.*, u.nombres, u.apellidos, d.manzana, d.calle, d.numero
       FROM facturas f
       JOIN usuarios u ON f.usuario_id = u.id
       JOIN domicilios d ON f.domicilio_id = d.id
       ${where}
       ORDER BY f.fecha_emision DESC`,
      { bind: params }
    );

    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al obtener facturas:', error);
    res.status(500).json({ error: true, message: 'Error al obtener facturas' });
  }
};
