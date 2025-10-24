import express from 'express';
import { generarFacturas, getFacturas } from '../controllers/facturasController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Generar facturas por periodo (solo admin)
router.post('/generar', verifyToken, authorize('admin'), generarFacturas);

// Consultar facturas (admin, cajero, supervisor)
router.get('/', verifyToken, authorize('admin', 'cajero', 'supervisor'), getFacturas);

export default router;
