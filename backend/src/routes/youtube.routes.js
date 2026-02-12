import { Router } from 'express';
import { uploadToYoutube } from '../controllers/youtube.controller.js';
const router = Router();

router.post('/upload', uploadToYoutube);

export default router;