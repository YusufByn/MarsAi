import express from 'express';
import { ratingController } from '../controllers/rating.controller.js';
import { validateRatingUpsert } from '../middlewares/validator/rating.validator.js';

const router = express.Router();

router.get('/:videoId/:userId', ratingController.getOne);
router.post('/', validateRatingUpsert, ratingController.upsert);

export default router;
