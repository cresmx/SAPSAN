import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import medicionRoutes from './routes/mediciones.js';
import facturaRoutes from './routes/facturas.js';
import reportesRoutes from './routes/reportesRoutes.js';
import domicilioRoutes from './routes/domicilios.js';
import medidorRoutes from './routes/medidores.js';
import path from 'path';
import pagoRoutes from './routes/pagos.js';
import listEndpoints from 'express-list-endpoints';
import healthRoutes from "./routes/healthRoutes.js";

// ...


dotenv.config();
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);

const app = express();
const PORT = process.env.PORT || 5000;

console.log(listEndpoints(app));

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/mediciones', medicionRoutes);
app.use('/api/facturas', facturaRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/domicilios', domicilioRoutes);
app.use('/api/medidores', medidorRoutes);
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/api/pagos', pagoRoutes);
app.use("/api", healthRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor funcionando correctamente' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: true,
    message: err.message || 'Error interno del servidor'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: true, message: 'Ruta no encontrada' });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📊 Ambiente: ${process.env.NODE_ENV}`);
});