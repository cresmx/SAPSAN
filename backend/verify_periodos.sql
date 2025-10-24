-- Verificar evolución de consumos, facturas y pagos por periodo

SELECT 
    u.numero_usuario,
    u.nombres,
    u.apellidos,
    d.id AS domicilio_id,
    m.periodo,
    m.lectura_anterior,
    m.lectura_actual,
    m.consumo,
    f.id AS factura_id,
    f.numero_factura,
    f.total AS total_factura,
    f.estado AS estado_factura,
    p.id AS pago_id,
    p.monto AS monto_pago,
    p.metodo_pago,
    p.fecha_pago
FROM usuarios u
JOIN domicilios d ON d.usuario_id = u.id
LEFT JOIN mediciones m ON m.domicilio_id = d.id
LEFT JOIN facturas f ON f.medicion_id = m.id
LEFT JOIN pagos p ON p.factura_id = f.id
WHERE u.numero_usuario LIKE 'TEST%'
ORDER BY u.numero_usuario, d.id, m.periodo;
