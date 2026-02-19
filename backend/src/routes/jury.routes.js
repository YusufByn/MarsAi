import express from 'express';
import { juryController } from '../controllers/jury.controller.js';
import { validateCreate, validateUpdate } from '../middlewares/validator/jury.validator.js';
import { checkAuth, restrictTo } from '../middlewares/auth.middleware.js';
import { apiLimiter } from '../middlewares/rateLimiter.middleware.js';

const router = express.Router();

router.use(apiLimiter);

router.get('/', juryController.getAll);
router.get('/:id', juryController.getById);


router.use(checkAuth);

router.use(restrictTo('admin', 'superadmin'));

router.post('/', validateCreate, juryController.create);
// route pour mettre à jour un jury
router.put('/:id', validateUpdate, juryController.update);
// route pour supprimer un jury
router.delete('/:id', juryController.delete);

export default router;
