import express from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserHistory
} from '../controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { auditoriaMiddleware } from '../middleware/auditoria.js';

const router = express.Router();

router.get('/', verifyToken, authorize('admin', 'supervisor'), getUsers);
router.get('/:id', verifyToken, authorize('admin', 'supervisor'), getUserById);
router.get('/:id/historial', verifyToken, authorize('admin', 'supervisor'), getUserHistory);

router.post(
  '/',
  verifyToken,
  authorize('admin', 'supervisor'),
  auditoriaMiddleware('crear', 'usuario'),
  createUser
);

router.put(
  '/:id',
  verifyToken,
  authorize('admin', 'supervisor'),
  auditoriaMiddleware('actualizar', 'usuario'),
  updateUser
);

router.delete(
  '/:id',
  verifyToken,
  authorize('admin', 'supervisor'),
  auditoriaMiddleware('eliminar', 'usuario'),
  deleteUser
);

export default router;
