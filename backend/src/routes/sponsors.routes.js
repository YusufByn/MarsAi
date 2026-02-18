import express from 'express';
import { sponsorsController } from '../controllers/sponsors.controller.js';
import { checkAuth, restrictTo } from '../middlewares/auth.middleware.js';
import { uploadSponsorCover } from '../middlewares/sponsor-upload.middleware.js';

const router = express.Router();

// Routes publiques (lecture)
router.get('/', sponsorsController.getAll);
router.get('/:id', sponsorsController.getById);

// Routes protégées (écriture)
router.use(checkAuth);
router.use(restrictTo('superadmin'));

router.post('/admin/all', sponsorsController.getAllAdmin);
router.post('/', uploadSponsorCover, sponsorsController.create);
router.put('/:id', uploadSponsorCover, sponsorsController.update);
router.post('/:id/visibility', sponsorsController.setVisibility);
router.delete('/:id', sponsorsController.delete);

export default router;
