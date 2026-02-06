import { Router} from 'express';
import { uploadVideo } from '../controllers/video.controller.js';

const router = Router();

router.post('/video', uploadVideo);


export default router;