-- Verificar usuarios de prueba
SELECT 
    u.id AS usuario_id,
    u.numero_usuario,
    u.nombres,
    u.apellidos,
    u.tipo_usuario,
    u.estado
FROM usuarios u
WHERE u.numero_usuario LIKE 'TEST%'
ORDER BY u.id DESC;

-- Verificar domicilios de usuarios de prueba
SELECT 
    d.id AS domicilio_id,
    d.usuario_id,
    d.manzana,
    d.calle,
    d.numero,
    d.referencia,
    d.activo
FROM domicilios d
JOIN usuarios u ON d.usuario_id = u.id
WHERE u.numero_usuario LIKE 'TEST%'
ORDER BY d.id DESC;

-- Verificar medidores de prueba
SELECT 
    m.id AS medidor_id,
    m.numero_medidor,
    m.estado,
    m.marca,
    m.modelo,
    m.fecha_instalacion,
    m.lectura_inicial,
    d.id AS domicilio_id,
    u.numero_usuario
FROM medidores m
JOIN domicilios d ON m.domicilio_id = d.id
JOIN usuarios u ON d.usuario_id = u.id
WHERE m.numero_medidor LIKE 'MED-TEST%'
   OR u.numero_usuario LIKE 'TEST%'
ORDER BY m.id DESC;

-- Verificar mediciones de prueba
SELECT 
    me.id AS medicion_id,
    me.domicilio_id,
    me.lectura_anterior,
    me.lectura_actual,
    me.periodo,
    me.fecha_lectura,
    u.numero_usuario
FROM mediciones me
JOIN domicilios d ON me.domicilio_id = d.id
JOIN usuarios u ON d.usuario_id = u.id
WHERE u.numero_usuario LIKE 'TEST%'
ORDER BY me.id DESC;

-- Verificar facturas de prueba
SELECT 
    f.id AS factura_id,
    f.numero_factura,
    f.periodo,
    f.consumo,
    f.total,
    f.estado,
    f.medicion_id,
    u.numero_usuario
FROM facturas f
JOIN usuarios u ON f.usuario_id = u.id
WHERE u.numero_usuario LIKE 'TEST%'
ORDER BY f.id DESC;

-- Verificar pagos de prueba
SELECT 
    p.id AS pago_id,
    p.factura_id,
    p.monto,
    p.metodo_pago,
    p.fecha_pago,
    f.numero_factura,
    u.numero_usuario
FROM pagos p
JOIN facturas f ON p.factura_id = f.id
JOIN usuarios u ON f.usuario_id = u.id
WHERE u.numero_usuario LIKE 'TEST%'
ORDER BY p.id DESC;
