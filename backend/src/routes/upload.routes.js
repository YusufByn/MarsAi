import { Router } from 'express';
import { upload, uploadCoverOnly, uploadStillsOnly } from '../middlewares/upload.middleware.js';
import { verifyRecaptcha } from '../middlewares/recaptcha.middleware.js';
import { uploadVideo, updateVideoCover, updateVideoStills } from '../controllers/video.controller.js';
import { validateCreateVideo } from '../../../shared/validators/video.validator.js';
import { apiLimiter } from '../middlewares/rateLimiter.middleware.js';
import { checkAuth, restrictTo } from '../middlewares/auth.middleware.js';

const router = Router();


router.use(apiLimiter);

router.post('/video', upload, verifyRecaptcha, validateCreateVideo, uploadVideo);

router.post('/videos/:id/upload-cover', checkAuth, restrictTo('admin', 'superadmin'), uploadCoverOnly, updateVideoCover);
router.post('/videos/:id/upload-stills', checkAuth, restrictTo('admin', 'superadmin'), uploadStillsOnly, updateVideoStills);

export default router;
