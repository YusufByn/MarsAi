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
router.post('/admin/sections', sponsorsController.getSections);
router.post('/admin/sections/order', sponsorsController.moveSection);
router.post('/admin/sections/rename', sponsorsController.renameSection);
router.post('/admin/sections/delete', sponsorsController.deleteSection);
router.post('/', uploadSponsorCover, sponsorsController.create);
router.put('/:id', uploadSponsorCover, sponsorsController.update);
router.post('/:id/order', sponsorsController.moveOrder);
router.post('/:id/visibility', sponsorsController.setVisibility);
router.delete('/:id', sponsorsController.delete);

export default router;
