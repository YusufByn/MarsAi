import express from 'express';
import { memoController } from '../controllers/memo.controller.js';
import { validateMemoUpsert } from '../middlewares/validator/memo.validator.js';

const router = express.Router();

router.get('/:videoId/:userId', memoController.getOne);
router.post('/', validateMemoUpsert, memoController.upsert);

export default router;
