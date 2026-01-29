import express from 'express';
import { juryController } from '../controllers/jury.controller.js';
import { validateCreate, validateUpdate } from '../middlewares/validator/jury.validator.js';

const router = express.Router();

// Routes publiques
router.get('/', juryController.getAll);
router.get('/:id', juryController.getById);

// Routes protégées (à sécuriser avec un middleware auth plus tard)
// TODO: Ajouter middleware auth pour vérifier role='superadmin'
router.post('/', validateCreate, juryController.create);
router.put('/:id', validateUpdate, juryController.update);
router.delete('/:id', juryController.delete);

export default router;
