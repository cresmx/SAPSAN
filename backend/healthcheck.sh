#!/bin/bash

APP_NAME="agua-backend"
URL="http://127.0.0.1:5000/api/health"

echo "=== Healthcheck Backend Agua Potable ==="

# 1. Verificar que el proceso de PM2 está corriendo
if pm2 status $APP_NAME | grep -q "online"; then
  echo "[OK] Proceso $APP_NAME está en ejecución bajo PM2"
else
  echo "[ERROR] Proceso $APP_NAME no está corriendo"
  exit 1
fi

# 2. Verificar que el puerto 5000 está escuchando
if sudo lsof -i -P -n | grep -q ":5000 (LISTEN)"; then
  echo "[OK] Puerto 5000 está escuchando"
else
  echo "[ERROR] Puerto 5000 no está escuchando"
  exit 1
fi

# 3. Hacer request al endpoint público de health
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $URL)

if [ "$RESPONSE" -eq 200 ]; then
  echo "[OK] Endpoint $URL responde correctamente (HTTP 200)"
else
  echo "[ERROR] Endpoint $URL no responde correctamente (HTTP $RESPONSE)"
  exit 1
fi

echo "=== Healthcheck completado con éxito ==="
