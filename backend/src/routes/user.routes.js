import express from 'express';
import { userController } from '../controllers/user.controller.js';
import { checkAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Route pour récupérer un user par ID (authentification requise)
router.get('/:id', checkAuth, userController.getById);

export default router;
