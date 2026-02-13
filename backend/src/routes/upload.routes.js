import { Router } from 'express';
import { upload } from '../middlewares/upload.middleware.js';
import { verifyRecaptcha } from '../middlewares/recaptcha.middleware.js';
import { uploadVideo } from '../controllers/video.controller.js';

const router = Router();

router.post('/video', upload, verifyRecaptcha, uploadVideo);

export default router;
