-- Script de inicialización de base de datos
-- Ejecutar: psql -U agua_admin -d agua_potable -f init-db.sql

-- Crear las tablas si no existen
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    numero_usuario VARCHAR(20) UNIQUE NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    direccion TEXT NOT NULL,
    telefono VARCHAR(15),
    email VARCHAR(100),
    tipo_usuario VARCHAR(20) DEFAULT 'domestico',
    estado VARCHAR(20) DEFAULT 'activo',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS medidores (
    id SERIAL PRIMARY KEY,
    numero_medidor VARCHAR(50) UNIQUE NOT NULL,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    marca VARCHAR(50),
    modelo VARCHAR(50),
    fecha_instalacion DATE,
    lectura_inicial DECIMAL(10,2) DEFAULT 0,
    estado VARCHAR(20) DEFAULT 'activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mediciones (
    id SERIAL PRIMARY KEY,
    medidor_id INTEGER REFERENCES medidores(id) ON DELETE CASCADE,
    lectura_anterior DECIMAL(10,2) NOT NULL,
    lectura_actual DECIMAL(10,2) NOT NULL,
    consumo DECIMAL(10,2) GENERATED ALWAYS AS (lectura_actual - lectura_anterior) STORED,
    periodo VARCHAR(7) NOT NULL,
    fecha_lectura DATE NOT NULL,
    observaciones TEXT,
    leido_por VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tarifas (
    id SERIAL PRIMARY KEY,
    tipo_usuario VARCHAR(20) NOT NULL,
    consumo_minimo DECIMAL(10,2) NOT NULL,
    consumo_maximo DECIMAL(10,2),
    tarifa_base DECIMAL(10,2) NOT NULL,
    tarifa_por_m3 DECIMAL(10,2) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    activa BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS facturas (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    medicion_id INTEGER REFERENCES mediciones(id),
    numero_factura VARCHAR(50) UNIQUE NOT NULL,
    periodo VARCHAR(7) NOT NULL,
    consumo DECIMAL(10,2) NOT NULL,
    monto_consumo DECIMAL(10,2) NOT NULL,
    monto_fijo DECIMAL(10,2) DEFAULT 0,
    otros_cargos DECIMAL(10,2) DEFAULT 0,
    descuentos DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    estado VARCHAR(20) DEFAULT 'pendiente',
    fecha_emision DATE NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pagos (
    id SERIAL PRIMARY KEY,
    factura_id INTEGER REFERENCES facturas(id) ON DELETE CASCADE,
    monto DECIMAL(10,2) NOT NULL,
    metodo_pago VARCHAR(20) NOT NULL,
    numero_referencia VARCHAR(100),
    fecha_pago DATE NOT NULL,
    recibido_por VARCHAR(100),
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS usuarios_sistema (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nombre_completo VARCHAR(150) NOT NULL,
    rol VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    activo BOOLEAN DEFAULT true,
    ultimo_acceso TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_usuarios_numero ON usuarios(numero_usuario);
CREATE INDEX IF NOT EXISTS idx_medidores_usuario ON medidores(usuario_id);
CREATE INDEX IF NOT EXISTS idx_mediciones_medidor ON mediciones(medidor_id);
CREATE INDEX IF NOT EXISTS idx_mediciones_periodo ON mediciones(periodo);
CREATE INDEX IF NOT EXISTS idx_facturas_usuario ON facturas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_facturas_periodo ON facturas(periodo);
CREATE INDEX IF NOT EXISTS idx_facturas_estado ON facturas(estado);
CREATE INDEX IF NOT EXISTS idx_pagos_factura ON pagos(factura_id);

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
DROP TRIGGER IF EXISTS update_usuarios_updated_at ON usuarios;
CREATE TRIGGER update_usuarios_updated_at 
    BEFORE UPDATE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_medidores_updated_at ON medidores;
CREATE TRIGGER update_medidores_updated_at 
    BEFORE UPDATE ON medidores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_facturas_updated_at ON facturas;
CREATE TRIGGER update_facturas_updated_at 
    BEFORE UPDATE ON facturas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_usuarios_sistema_updated_at ON usuarios_sistema;
CREATE TRIGGER update_usuarios_sistema_updated_at 
    BEFORE UPDATE ON usuarios_sistema
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insertar tarifas por defecto
INSERT INTO tarifas (tipo_usuario, consumo_minimo, consumo_maximo, tarifa_base, tarifa_por_m3, fecha_inicio, activa)
VALUES 
    ('domestico', 0, 10, 50.00, 5.00, CURRENT_DATE, true),
    ('domestico', 10, 20, 50.00, 7.00, CURRENT_DATE, true),
    ('domestico', 20, NULL, 50.00, 10.00, CURRENT_DATE, true),
    ('comercial', 0, NULL, 100.00, 15.00, CURRENT_DATE, true),
    ('publico', 0, NULL, 150.00, 12.00, CURRENT_DATE, true)
ON CONFLICT DO NOTHING;

-- Insertar usuario administrador por defecto
-- Usuario: admin / Password: admin123 (CAMBIAR EN PRODUCCIÓN)
INSERT INTO usuarios_sistema (username, password_hash, nombre_completo, rol, email, activo)
VALUES ('admin', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8.8JLbGDFIxJLJZvhGLJZLCqGXqGWe', 'Administrador del Sistema', 'admin', 'admin@aguapotable.com', true)
ON CONFLICT (username) DO NOTHING;

-- Datos de ejemplo (opcional - comentar en producción)
-- INSERT INTO usuarios (numero_usuario, nombres, apellidos, direccion, telefono, tipo_usuario)
-- VALUES 
--     ('001', 'Juan', 'Pérez García', 'Calle Principal #123', '4421234567', 'domestico'),
--     ('002', 'María', 'López Martínez', 'Av. Juárez #456', '4427654321', 'domestico'),
--     ('003', 'Tienda La Esquina', 'S.A. de C.V.', 'Calle Comercio #789', '4423456789', 'comercial');

PRINT 'Base de datos inicializada correctamente';