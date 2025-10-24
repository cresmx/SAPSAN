-- Listar medidores de prueba creados en tests
SELECT 
    m.id AS medidor_id,
    m.numero_medidor,
    m.estado,
    m.marca,
    m.modelo,
    m.fecha_instalacion,
    m.lectura_inicial,
    d.id AS domicilio_id,
    d.manzana,
    d.calle,
    d.numero,
    u.id AS usuario_id,
    u.numero_usuario,
    u.nombres,
    u.apellidos
FROM medidores m
LEFT JOIN domicilios d ON m.domicilio_id = d.id
LEFT JOIN usuarios u ON d.usuario_id = u.id
WHERE m.numero_medidor LIKE 'MED-TEST%'
ORDER BY m.id DESC
LIMIT 20;
