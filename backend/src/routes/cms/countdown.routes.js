import express from 'express';
import { getHomepage } from '../../controllers/cms/countdown.controller.js';

const router = express.Router();

// Route publique pour récupérer les données de la homepage
router.get('/homepage', getHomepage);

export default router;
