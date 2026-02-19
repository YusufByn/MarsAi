import express from 'express';
import { memoController } from '../controllers/memo.controller.js';
import { validateMemoUpsert } from '../../../shared/validators/memo.validator.js';
import { apiLimiter } from '../middlewares/rateLimiter.middleware.js';

const router = express.Router();

router.use(apiLimiter);
router.get('/user/:userId', memoController.getAllByUser);
router.get('/:videoId/:userId', memoController.getOne);
router.post('/', validateMemoUpsert, memoController.upsert);

export default router;
