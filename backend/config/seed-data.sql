-- Datos de prueba para Sistema de Cobro de Agua Potable

-- Insertar usuario administrador del sistema
-- Password: admin123 (debe ser hasheado con bcrypt en producción)
INSERT INTO usuarios_sistema (username, password_hash, nombre_completo, rol, email, activo) 
VALUES (
  'admin',
  '$2a$10$rZ5z0XqHJC8Y5v8Y5v8Y5ujKvB.C0QnM8Y5v8Y5v8Y5v8Y5v8Y5v8Y',
  'Administrador Sistema',
  'admin',
  'admin@agua.com',
  true
) ON CONFLICT (username) DO NOTHING;

-- Insertar tarifa por defecto para usuarios domésticos
INSERT INTO tarifas (tipo_usuario, consumo_minimo, consumo_maximo, tarifa_base, tarifa_por_m3, fecha_inicio, activa)
VALUES 
  ('domestico', 0, 10, 50.00, 5.00, CURRENT_DATE, true),
  ('comercial', 0, 20, 100.00, 8.00, CURRENT_DATE, true),
  ('industrial', 0, 50, 200.00, 12.00, CURRENT_DATE, true)
ON CONFLICT DO NOTHING;

-- Usuarios de ejemplo
INSERT INTO usuarios (numero_usuario, nombres, apellidos, direccion, telefono, email, tipo_usuario, estado)
VALUES 
  ('USR-001', 'Juan', 'Pérez García', 'Calle Principal #123', '4421234567', 'juan.perez@email.com', 'domestico', 'activo'),
  ('USR-002', 'María', 'González López', 'Av. Central #456', '4427654321', 'maria.gonzalez@email.com', 'domestico', 'activo'),
  ('USR-003', 'Comercial La Esquina', 'S.A. de C.V.', 'Plaza Comercial #789', '4429876543', 'contacto@laesquina.com', 'comercial', 'activo')
ON CONFLICT (numero_usuario) DO NOTHING;

-- Medidores de ejemplo
INSERT INTO medidores (numero_medidor, usuario_id, marca, modelo, fecha_instalacion, lectura_inicial, estado)
SELECT 
  'MED-001', 
  id, 
  'Itron', 
  'Aquadis+', 
  '2024-01-01', 
  0, 
  'activo'
FROM usuarios WHERE numero_usuario = 'USR-001'
ON CONFLICT (numero_medidor) DO NOTHING;

INSERT INTO medidores (numero_medidor, usuario_id, marca, modelo, fecha_instalacion, lectura_inicial, estado)
SELECT 
  'MED-002', 
  id, 
  'Sensus', 
  'iPERL', 
  '2024-01-01', 
  0, 
  'activo'
FROM usuarios WHERE numero_usuario = 'USR-002'
ON CONFLICT (numero_medidor) DO NOTHING;

INSERT INTO medidores (numero_medidor, usuario_id, marca, modelo, fecha_instalacion, lectura_inicial, estado)
SELECT 
  'MED-003', 
  id, 
  'Elster', 
  'V100', 
  '2024-01-01', 
  0, 
  'activo'
FROM usuarios WHERE numero_usuario = 'USR-003'
ON CONFLICT (numero_medidor) DO NOTHING;

SELECT 'Datos de prueba insertados correctamente' as mensaje;
