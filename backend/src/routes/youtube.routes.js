import { Router } from 'express';
import { uploadToYoutube } from '../controllers/youtube.controller.js';
import { requireRole } from '../middlewares/requireRole.middleware.js';
import { checkAuth } from '../middlewares/auth.middleware.js';
const router = Router();

router.post('/upload', checkAuth, requireRole('admin', 'superadmin'), uploadToYoutube);

export default router;