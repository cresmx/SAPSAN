import sequelize from '../config/sequelize.js';

// @desc    Dashboard con métricas generales
// @route   GET /api/reportes/dashboard
// @access  Private (Admin/Supervisor)
export const getDashboard = async (req, res) => {
  try {
    // Usuarios activos (con al menos una medición en el último periodo)
    const [usuariosActivos] = await sequelize.query(`
      SELECT COUNT(DISTINCT d.usuario_id) AS usuarios_activos
      FROM mediciones m
      JOIN domicilios d ON m.domicilio_id = d.id
      WHERE m.periodo = (SELECT MAX(periodo) FROM mediciones)
    `);

    // Consumo total
    const [consumoTotal] = await sequelize.query(`
      SELECT SUM(consumo) AS consumo_total_m3
      FROM mediciones
    `);

    // Facturas emitidas, monto facturado y pendiente
    const [facturas] = await sequelize.query(`
      SELECT 
        COUNT(*) AS facturas_emitidas,
        SUM(total) AS monto_facturado,
        SUM(CASE WHEN estado = 'pendiente' THEN total ELSE 0 END) AS monto_pendiente
      FROM facturas
    `);

    // Pagos registrados y monto pagado
    const [pagos] = await sequelize.query(`
      SELECT 
        COUNT(*) AS pagos_registrados,
        SUM(monto) AS monto_pagado
      FROM pagos
    `);

    res.json({
      success: true,
      data: {
        usuarios_activos: usuariosActivos[0]?.usuarios_activos || 0,
        consumo_total_m3: consumoTotal[0]?.consumo_total_m3 || 0,
        facturas_emitidas: facturas[0]?.facturas_emitidas || 0,
        monto_facturado: facturas[0]?.monto_facturado || 0,
        monto_pendiente: facturas[0]?.monto_pendiente || 0,
        pagos_registrados: pagos[0]?.pagos_registrados || 0,
        monto_pagado: pagos[0]?.monto_pagado || 0,
      },
    });
  } catch (error) {
    console.error('Error en dashboard:', error);
    res.status(500).json({ error: true, message: 'Error al obtener dashboard' });
  }
};

// @desc    Reporte de consumos por periodo
// @route   GET /api/reportes/consumos
// @access  Private (Admin/Supervisor)
export const getConsumos = async (req, res) => {
  try {
    const [rows] = await sequelize.query(`
      SELECT 
        periodo,
        SUM(consumo) AS total_consumo
      FROM mediciones
      GROUP BY periodo
      ORDER BY periodo
    `);

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error en reporte de consumos:", error);
    res.status(500).json({ error: true, message: "Error al obtener consumos" });
  }
};
