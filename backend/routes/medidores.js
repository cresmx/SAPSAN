import express from 'express';
import {
  getMedidorByDomicilio,
  createMedidor,
  updateMedidor,
  deleteMedidor
} from '../controllers/medidoresController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Medidor por domicilio
router.get('/domicilio/:id', verifyToken, authorize('admin', 'supervisor'), getMedidorByDomicilio);
router.post('/domicilio/:id', verifyToken, authorize('admin'), createMedidor);

// Operaciones sobre medidor
router.put('/:id', verifyToken, authorize('admin', 'supervisor'), updateMedidor);
router.delete('/:id', verifyToken, authorize('admin'), deleteMedidor);

export default router;
