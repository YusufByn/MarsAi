import express from 'express';
import { userController } from '../controllers/user.controller.js';

const router = express.Router();

// Route pour récupérer un user par ID
router.get('/:id', userController.getById);

export default router;
