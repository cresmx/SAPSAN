#!/bin/bash

# Script de despliegue para aplicación de agua potable
# Uso: ./scripts/deploy.sh

set -e

echo "🚀 Iniciando proceso de despliegue..."

# Configuración
VPS_USER="ubuntu"  # Cambiar por tu usuario
VPS_HOST="tu-ip-vps"  # Cambiar por tu IP
VPS_PATH="/var/www/agua-potable"
SSH_KEY="ruta/a/tu/llave.pem"  # Cambiar por la ruta a tu llave

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📦 Paso 1: Compilando frontend...${NC}"
cd frontend
npm run build
cd ..

echo -e "${GREEN}✅ Frontend compilado${NC}"

echo -e "${YELLOW}📤 Paso 2: Sincronizando archivos al VPS...${NC}"

# Sincronizar backend
rsync -avz --delete \
  --exclude 'node_modules' \
  --exclude '.env' \
  -e "ssh -i $SSH_KEY" \
  ./backend/ $VPS_USER@$VPS_HOST:$VPS_PATH/backend/

# Sincronizar frontend compilado
rsync -avz --delete \
  -e "ssh -i $SSH_KEY" \
  ./frontend/dist/ $VPS_USER@$VPS_HOST:$VPS_PATH/frontend/dist/

echo -e "${GREEN}✅ Archivos sincronizados${NC}"

echo -e "${YELLOW}🔧 Paso 3: Instalando dependencias y reiniciando servicios...${NC}"

ssh -i $SSH_KEY $VPS_USER@$VPS_HOST << 'ENDSSH'
  cd /var/www/agua-potable/backend
  
  # Instalar dependencias si es necesario
  if [ ! -d "node_modules" ]; then
    echo "Instalando dependencias del backend..."
    npm install --production
  fi
  
  # Reiniciar aplicación con PM2
  pm2 restart agua-potable || pm2 start server.js --name agua-potable
  
  # Guardar configuración de PM2
  pm2 save
  
  echo "✅ Aplicación reiniciada"
ENDSSH

echo -e "${GREEN}✅ Despliegue completado exitosamente${NC}"
echo -e "${GREEN}🌐 Tu aplicación está disponible en: http://$VPS_HOST${NC}"