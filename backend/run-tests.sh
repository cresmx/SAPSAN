#!/bin/bash
set -e

DB_NAME="agua_potable"
DB_USER="agua_admin"
SQL_FILE="cleanup_test_data.sql"

echo "=== LIMPIANDO DATOS DE PRUEBA ==="
psql -d $DB_NAME -U $DB_USER -f $SQL_FILE

echo "=== EJECUTANDO TESTS DE ENDPOINTS ==="
node test-endpoints-extended.js
