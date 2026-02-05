import express from 'express';
import { adminController } from '../controllers/admin.controller.js';
import { isAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(isAdmin); 

router.get('/videos', adminController.listVideos);

router.patch('/videos/:id/status', adminController.updateStatus);
router.delete('/videos/:id', adminController.deleteVideo);

export default router;