import { Router } from 'express';

import authRoutes from './auth.routes.js';
import uploadRoutes from './upload.routes.js';
import juryRoutes from './jury.routes.js';
import newsletterRoutes from './newsletter.routes.js';
import memoRoutes from './memo.routes.js';
import ratingRoutes from './rating.routes.js';
import videoRoutes from './video.routes.js';
import youtubeRoutes from './youtube.routes.js';
import playerRoutes from './player/player.routes.js';
import testRoutes from './test.routes.js';
import countdownRoutes from './cms/countdown.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/upload', uploadRoutes);
router.use('/jury', juryRoutes);
router.use('/newsletter', newsletterRoutes);
router.use('/memo', memoRoutes);
router.use('/rating', ratingRoutes);
router.use('/videos', videoRoutes);
router.use('/youtube', youtubeRoutes);
router.use('/player', playerRoutes);
router.use('/cms', countdownRoutes);

// testRoutes garde /test en interne - doit être en dernier pour ne pas intercepter les autres routes
router.use('/', testRoutes);

export default router;