import express from 'express';
import { juryController } from '../controllers/jury.controller.js';
import { validateCreate, validateUpdate } from '../middlewares/validator/jury.validator.js';
import { checkAuth } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/requireRole.middleware.js';

const router = express.Router();

// Routes publiques
// route pour récupérer tous les jurys
router.get('/', juryController.getAll);
// route pour récupérer un jury par id
router.get('/:id', juryController.getById);

// routes protégées
// route pour créer un jury
router.post('/', checkAuth, requireRole('superadmin', 'admin'), validateCreate, juryController.create);
// route pour mettre à jour un jury
router.put('/:id', checkAuth, requireRole('superadmin', 'admin'), validateUpdate, juryController.update);
// route pour supprimer un jury
router.delete('/:id', checkAuth, requireRole('superadmin', 'admin'), juryController.delete);

export default router;
