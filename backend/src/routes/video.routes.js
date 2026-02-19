import express from 'express';
import { videoPlayerController } from '../controllers/videoPlayer.controller.js';
import { apiLimiter } from '../middlewares/rateLimiter.middleware.js';

const router = express.Router();

router.use(apiLimiter);

router.get('/', videoPlayerController.getFeed);
router.get('/:id', videoPlayerController.getById);

export default router;
