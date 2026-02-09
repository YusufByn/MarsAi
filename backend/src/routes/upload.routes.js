import { Router} from 'express';
import { uploadVideo } from '../controllers/video.controller.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = Router();

router.post('/video', upload, uploadVideo);


export default router;