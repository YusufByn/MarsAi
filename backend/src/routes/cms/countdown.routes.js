import express from 'express';
import { getCountdown } from '../../controllers/cms/countdown.controller.js';

const router = express.Router();

// Route publique pour récupérer le countdown
router.get('/countdown', getCountdown);

export default router;