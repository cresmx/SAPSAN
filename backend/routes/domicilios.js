import express from 'express';
import {
  getDomiciliosByUser,
  createDomicilio,
  updateDomicilio,
  deleteDomicilio
} from '../controllers/domiciliosController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Rutas de domicilios
router.get('/usuario/:id', verifyToken, authorize('admin', 'supervisor'), getDomiciliosByUser);
router.post('/usuario/:id', verifyToken, authorize('admin', 'supervisor'), createDomicilio);
router.put('/:id', verifyToken, authorize('admin', 'supervisor'), updateDomicilio);
router.delete('/:id', verifyToken, authorize('admin', 'supervisor'), deleteDomicilio);

export default router;
