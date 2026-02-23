import express from 'express';
import { ratingController } from '../controllers/rating.controller.js';
import { validateRatingUpsert } from '../../../shared/validators/rating.validator.js';
import { apiLimiter } from '../middlewares/rateLimiter.middleware.js';

const router = express.Router();

router.use(apiLimiter);

router.get('/:videoId/:userId', ratingController.getOne);
router.post('/', validateRatingUpsert, ratingController.upsert);
router.delete('/:videoId/:userId', ratingController.deleteRating);

export default router;
