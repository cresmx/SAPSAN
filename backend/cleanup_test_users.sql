-- Eliminar todos los usuarios de prueba
DELETE FROM usuarios
WHERE numero_usuario LIKE 'TEST%';

-- Reiniciar el contador de IDs
ALTER SEQUENCE usuarios_id_seq RESTART WITH 1;

-- (Opcional) Verificar que la tabla quedó vacía de pruebas
SELECT * FROM usuarios WHERE numero_usuario LIKE 'TEST%';
