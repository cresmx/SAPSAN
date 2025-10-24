import express from 'express';
import { getMedicionesByDomicilio, createMedicion, upload } from '../controllers/medicionesController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { auditoriaMiddleware } from '../middleware/auditoria.js';

const router = express.Router();

// Consultar mediciones de un domicilio
router.get(
  '/domicilio/:id',
  verifyToken,
  authorize('admin', 'supervisor', 'cajero'),
  getMedicionesByDomicilio
);

// Capturista registra nueva medición con foto y GPS
router.post(
  '/',
  verifyToken,
  authorize('capturista', 'admin'),
  upload.single('foto'),
  auditoriaMiddleware('capturar', 'medicion'),
  createMedicion
);

export default router;
