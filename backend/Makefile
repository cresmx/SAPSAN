# Variables
DB_NAME = agua_potable
DB_USER = agua_admin
SQL_FILE = cleanup_test_data.sql

# Target por defecto
all: test

# Limpieza de datos de prueba
clean:
    @echo "=== LIMPIANDO DATOS DE PRUEBA ==="
    psql -d $(DB_NAME) -U $(DB_USER) -f $(SQL_FILE)

# Ejecutar pruebas (limpieza + test)
test: clean
    @echo "=== EJECUTANDO TESTS DE ENDPOINTS ==="
    node test-endpoints.js

# Solo correr el script de pruebas sin limpiar
run:
    @echo "=== EJECUTANDO TESTS SIN LIMPIEZA ==="
    node test-endpoints.js