import { Router } from 'express';
import { createTags } from '../controllers/tag.controller.js';

const router = Router();

router.post('/insert', createTags);

export default router;