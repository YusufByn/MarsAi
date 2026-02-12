import { Router } from 'express';
import { uploadToYoutube } from '../controllers/youtube.controller.js';
import { checkAuth, restrictTo } from '../middlewares/auth.middleware.js';
const router = Router();

router.use(checkAuth);
router.use(restrictTo('admin', 'superadmin'));


router.post('/upload', uploadToYoutube);

export default router;