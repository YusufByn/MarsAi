import { Router } from 'express';
import tagController from '../controllers/tag.controller.js';

const router = Router();

/**
 * GET /api/tags
 * Récupérer tous les tags existants
 */
router.get('/', tagController.getAllTags);

/**
 * GET /api/tags/search?q=...
 * Rechercher des tags par nom
 */
router.get('/search', tagController.searchTags);

export default router;
