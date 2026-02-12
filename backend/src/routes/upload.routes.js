import { Router } from 'express';
import videoSubmissionController from '../controllers/videoSubmission.controller.js';
import upload from '../middlewares/upload.middleware.js';
import { validateCreateVideo, validateUpdateVideo } from '../../../shared/validators/video.validator.js';
import { sanitizeMiddleware } from '../middlewares/sanitize.middleware.js';
import { validateEditTokenMiddleware } from '../middlewares/validateEditToken.middleware.js';
import { checkAuth } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/requireRole.middleware.js';
import videoController from '../controllers/video.controller.js';

const router = Router();

router.post('/video', upload, uploadVideo);

export default router;
