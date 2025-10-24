-- 1. Eliminar pagos asociados a facturas de usuarios de prueba
DELETE FROM pagos
WHERE factura_id IN (
  SELECT f.id
  FROM facturas f
  JOIN usuarios u ON f.usuario_id = u.id
  WHERE u.numero_usuario LIKE 'TEST%'
);

-- 2. Eliminar facturas de usuarios de prueba
DELETE FROM facturas
WHERE usuario_id IN (
  SELECT id FROM usuarios WHERE numero_usuario LIKE 'TEST%'
);

-- 3. Eliminar mediciones asociadas a domicilios de usuarios de prueba
DELETE FROM mediciones
WHERE domicilio_id IN (
  SELECT d.id
  FROM domicilios d
  JOIN usuarios u ON d.usuario_id = u.id
  WHERE u.numero_usuario LIKE 'TEST%'
);

-- 4. Eliminar medidores asociados a domicilios de usuarios de prueba
DELETE FROM medidores
WHERE domicilio_id IN (
  SELECT d.id
  FROM domicilios d
  JOIN usuarios u ON d.usuario_id = u.id
  WHERE u.numero_usuario LIKE 'TEST%'
);

-- 5. Eliminar domicilios de usuarios de prueba
DELETE FROM domicilios
WHERE usuario_id IN (
  SELECT id FROM usuarios WHERE numero_usuario LIKE 'TEST%'
);

-- 6. Finalmente, eliminar los usuarios de prueba
DELETE FROM usuarios
WHERE numero_usuario LIKE 'TEST%';

-- 7. Reiniciar secuencias para mantener IDs ordenados
ALTER SEQUENCE usuarios_id_seq RESTART WITH 1;
ALTER SEQUENCE domicilios_id_seq RESTART WITH 1;
ALTER SEQUENCE medidores_id_seq RESTART WITH 1;
ALTER SEQUENCE mediciones_id_seq RESTART WITH 1;
ALTER SEQUENCE facturas_id_seq RESTART WITH 1;
ALTER SEQUENCE pagos_id_seq RESTART WITH 1;

-- 8. Verificación integral (equivalente a verify_full.sql)

-- Usuarios de prueba
SELECT 'USUARIOS' AS seccion, u.* 
FROM usuarios u
WHERE u.numero_usuario LIKE 'TEST%';

-- Domicilios de prueba
SELECT 'DOMICILIOS' AS seccion, d.* 
FROM domicilios d
JOIN usuarios u ON d.usuario_id = u.id
WHERE u.numero_usuario LIKE 'TEST%';

-- Medidores de prueba
SELECT 'MEDIDORES' AS seccion, m.* 
FROM medidores m
JOIN domicilios d ON m.domicilio_id = d.id
JOIN usuarios u ON d.usuario_id = u.id
WHERE m.numero_medidor LIKE 'MED-TEST%' OR u.numero_usuario LIKE 'TEST%';

-- Mediciones de prueba
SELECT 'MEDICIONES' AS seccion, me.* 
FROM mediciones me
JOIN domicilios d ON me.domicilio_id = d.id
JOIN usuarios u ON d.usuario_id = u.id
WHERE u.numero_usuario LIKE 'TEST%';

-- Facturas de prueba
SELECT 'FACTURAS' AS seccion, f.* 
FROM facturas f
JOIN usuarios u ON f.usuario_id = u.id
WHERE u.numero_usuario LIKE 'TEST%';

-- Pagos de prueba
SELECT 'PAGOS' AS seccion, p.* 
FROM pagos p
JOIN facturas f ON p.factura_id = f.id
JOIN usuarios u ON f.usuario_id = u.id
WHERE u.numero_usuario LIKE 'TEST%';
