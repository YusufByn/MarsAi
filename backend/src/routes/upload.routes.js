import { Router } from 'express';
import { upload } from '../middlewares/upload.middleware.js';
import { verifyRecaptcha } from '../middlewares/recaptcha.middleware.js';
import { uploadVideo } from '../controllers/video.controller.js';
import { validateCreateVideo } from '../../../shared/validators/video.validator.js';

const router = Router();

router.post('/video', upload, verifyRecaptcha, validateCreateVideo, uploadVideo);

export default router;
