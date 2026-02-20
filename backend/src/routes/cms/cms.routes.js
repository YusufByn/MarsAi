import { Router } from 'express';
import { getAllCms, getCmsByElement } from '../../controllers/cms/cms.controller.js';

const router = Router();

router.get('/', getAllCms);
router.get('/:sectionType', getCmsByElement);

export default router;