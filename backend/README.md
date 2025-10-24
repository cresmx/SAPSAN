# Backend - Sistema de Cobro de Agua Potable

API REST para gestión de cobro de agua potable en comunidades pequeñas (PostgreSQL).

## 🚀 Instalación

```bash
npm install
```

## ⚙️ Configuración

1. Copiar `.env.example` a `.env`
2. Configurar las variables de entorno con tus credenciales PostgreSQL
3. La base de datos ya debe estar creada e inicializada

## 📦 Dependencias Necesarias

```bash
npm install express pg dotenv bcryptjs jsonwebtoken cors express-validator morgan
npm install --save-dev nodemon
```

## 🏃 Ejecución

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

## 📁 Estructura

- `/config` - Configuración de base de datos
- `/controllers` - Controladores de rutas
- `/models` - Modelos de base de datos
- `/routes` - Definición de rutas
- `/middleware` - Middleware personalizado
- `/services` - Lógica de negocio
- `/utils` - Utilidades y helpers

## 🔑 Variables de Entorno

Ver `.env.example` para la lista completa de variables requeridas.

## 📝 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión

### Usuarios
- `GET /api/users` - Listar usuarios
- `GET /api/users/:id` - Obtener usuario
- `POST /api/users` - Crear usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

### Medidores
- `GET /api/medidores` - Listar medidores
- `POST /api/medidores` - Crear medidor
- `GET /api/medidores/:id` - Obtener medidor

### Mediciones
- `GET /api/mediciones` - Listar mediciones
- `POST /api/mediciones` - Crear medición
- `GET /api/mediciones/:id` - Obtener medición

### Facturas
- `GET /api/facturas` - Listar facturas
- `POST /api/facturas` - Generar factura
- `GET /api/facturas/:id` - Obtener factura
- `PUT /api/facturas/:id/pagar` - Registrar pago

### Reportes
- `GET /api/reportes/consumo` - Reporte de consumo
- `GET /api/reportes/pagos` - Reporte de pagos
- `GET /api/reportes/morosos` - Reporte de morosos
