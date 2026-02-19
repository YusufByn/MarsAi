import express from 'express';
import { getHomepage } from '../../controllers/cms/countdown.controller.js';
import { apiLimiter } from '../middlewares/rateLimiter.middleware.js';

const router = express.Router();

router.use(apiLimiter);

// Route publique pour récupérer les données de la homepage
router.get('/homepage', getHomepage);

export default router;
