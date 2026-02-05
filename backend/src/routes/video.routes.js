import express from 'express';
import { videoPlayerController } from '../controllers/videoPlayer.controller.js';

const router = express.Router();

router.get('/', videoPlayerController.getFeed);
router.get('/:id', videoPlayerController.getById);

export default router;
