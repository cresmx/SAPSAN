import express from 'express';
import { getConsumos } from '../controllers/reportesController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Reportes de supervisor/admin
router.get('/consumos', verifyToken, authorize('admin', 'supervisor'), getConsumos);
//router.get('/ingresos', verifyToken, authorize('admin', 'supervisor'), getReporteIngresos);
//router.get('/acciones', verifyToken, authorize('admin', 'supervisor'), getReporteAcciones);

export default router;
