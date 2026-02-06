import { tagModel } from '../models/tag.model.js';

/**
 * Controller pour la gestion des tags
 */

/**
 * Récupérer tous les tags
 * Route: GET /api/tags
 */
export const getAllTags = async (req, res, next) => {
  try {
    const tags = await tagModel.findAll();

    res.status(200).json({
      success: true,
      count: tags.length,
      data: tags
    });
  } catch (error) {
    console.error('[TAG ERROR] Erreur récupération tags:', error);
    next(error);
  }
};

/**
 * Rechercher des tags
 * Route: GET /api/tags/search?q=...
 */
export const searchTags = async (req, res, next) => {
  try {
    const query = req.query.q || '';

    if (!query || query.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'La recherche doit contenir au moins 2 caractères'
      });
    }

    const tags = await tagModel.search(query);

    res.status(200).json({
      success: true,
      count: tags.length,
      data: tags
    });
  } catch (error) {
    console.error('[TAG ERROR] Erreur recherche tags:', error);
    next(error);
  }
};

export default {
  getAllTags,
  searchTags
};
