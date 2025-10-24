WITH consumos AS (
  SELECT 
    m.periodo,
    SUM(m.consumo) AS total_consumo
  FROM mediciones m
  GROUP BY m.periodo
),
facturas_cte AS (
  SELECT 
    f.periodo,
    COUNT(*) AS facturas_emitidas,
    SUM(f.total) AS total_facturado,
    SUM(CASE WHEN f.estado = 'pendiente' THEN f.total ELSE 0 END) AS total_pendiente
  FROM facturas f
  GROUP BY f.periodo
),
pagos AS (
  SELECT 
    f.periodo,
    COUNT(p.id) AS pagos_registrados,
    SUM(p.monto) AS total_pagado
  FROM pagos p
  JOIN facturas f ON p.factura_id = f.id   -- ahora sí referencia a la tabla real
  GROUP BY f.periodo
),
usuarios_activos AS (
  SELECT 
    m.periodo,
    COUNT(DISTINCT d.usuario_id) AS usuarios_con_medicion
  FROM mediciones m
  JOIN domicilios d ON m.domicilio_id = d.id
  GROUP BY m.periodo
)

SELECT 
  COALESCE(c.periodo, f.periodo, p.periodo, u.periodo) AS periodo,
  COALESCE(u.usuarios_con_medicion, 0) AS usuarios_activos,
  COALESCE(c.total_consumo, 0) AS consumo_total_m3,
  COALESCE(f.facturas_emitidas, 0) AS facturas_emitidas,
  COALESCE(f.total_facturado, 0) AS monto_facturado,
  COALESCE(p.pagos_registrados, 0) AS pagos_registrados,
  COALESCE(p.total_pagado, 0) AS monto_pagado,
  COALESCE(f.total_pendiente, 0) AS monto_pendiente
FROM consumos c
FULL JOIN facturas_cte f ON c.periodo = f.periodo
FULL JOIN pagos p ON COALESCE(c.periodo, f.periodo) = p.periodo
FULL JOIN usuarios_activos u ON COALESCE(c.periodo, f.periodo, p.periodo) = u.periodo
ORDER BY periodo;
