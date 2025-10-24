import express from 'express';
import { createPago, getPagosByFactura, getPagosByPeriodo } from '../controllers/pagosController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { auditoriaMiddleware } from '../middleware/auditoria.js';

const router = express.Router();

// Registrar pago
router.post(
  '/',
  verifyToken,
  authorize('cajero', 'admin'),
  auditoriaMiddleware('registrar', 'pago'),
  createPago
);

// Consultar pagos de una factura
router.get(
  '/factura/:factura_id',
  verifyToken,
  authorize('cajero', 'admin', 'supervisor'),
  getPagosByFactura
);

// Consultar pagos por periodo
router.get(
  '/',
  verifyToken,
  authorize('cajero', 'admin', 'supervisor'),
  getPagosByPeriodo
);

export default router;
