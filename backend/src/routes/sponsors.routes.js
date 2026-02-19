import express from 'express';
import { sponsorsController } from '../controllers/sponsors.controller.js';
import { checkAuth, restrictTo } from '../middlewares/auth.middleware.js';
import { uploadSponsorCover } from '../middlewares/sponsor-upload.middleware.js';
import {
  validateSponsorIdParam,
  validateCreateSponsor,
  validateUpdateSponsor,
  validateSetSponsorVisibility,
  validateMoveSponsorOrder,
  validateMoveSponsorTypeOrder,
} from '../../../shared/validators/sponsor.validator.js';

const router = express.Router();

// Routes publiques (lecture)
router.get('/', sponsorsController.getAll);
router.get('/:id', validateSponsorIdParam, sponsorsController.getById);

// Routes protégées (écriture)
router.use(checkAuth);
router.use(restrictTo('superadmin'));

router.post('/admin/all', sponsorsController.getAllAdmin);
router.post('/admin/types/order', validateMoveSponsorTypeOrder, sponsorsController.moveTypeOrder);
router.post('/', uploadSponsorCover, validateCreateSponsor, sponsorsController.create);
router.put('/:id', validateSponsorIdParam, uploadSponsorCover, validateUpdateSponsor, sponsorsController.update);
router.post('/:id/order', validateSponsorIdParam, validateMoveSponsorOrder, sponsorsController.moveOrder);
router.post('/:id/visibility', validateSponsorIdParam, validateSetSponsorVisibility, sponsorsController.setVisibility);
router.delete('/:id', validateSponsorIdParam, sponsorsController.delete);

export default router;
