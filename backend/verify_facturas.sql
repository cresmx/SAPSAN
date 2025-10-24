-- Verificar facturas con su medición asociada
SELECT 
    f.id AS factura_id,
    f.numero_factura,
    f.periodo,
    f.consumo,
    f.total,
    f.estado,
    f.medicion_id,
    m.lectura_anterior,
    m.lectura_actual,
    m.periodo AS periodo_medicion,
    m.fecha_lectura
FROM facturas f
LEFT JOIN mediciones m ON f.medicion_id = m.id
ORDER BY f.fecha_emision DESC
LIMIT 20;
