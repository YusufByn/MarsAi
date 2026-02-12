import express from 'express';
import { adminController } from '../controllers/admin.controller.js';
import { checkAuth, restrictTo } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(checkAuth); 
router.use(restrictTo('admin', 'superadmin'));

router.get('/stats', adminController.getDashboardStats);

router.get('/videos', adminController.listVideos);
router.patch('/videos/:id/status', adminController.updateStatus);
router.delete('/videos/:id', adminController.deleteVideo);

router.get('/events', adminController.listEvents);
router.post('/events', adminController.createEvent);
router.delete('/events/:id', adminController.deleteEvent);

router.get('/cms', adminController.getCms);
router.put('/cms/:section_type', adminController.updateCms); 

export default router;