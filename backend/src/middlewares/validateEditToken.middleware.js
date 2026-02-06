import { validateEditToken, extractTokenFromRequest } from '../utils/editToken.util.js';
import { videoModel } from '../models/video.model.js';

/**
 * Middleware pour valider le token d'édition avant modification de vidéo
 *
 * Vérifie :
 * 1. Présence du token dans la requête
 * 2. Validité du token (signature, expiration)
 * 3. Existence de la vidéo en DB
 * 4. Usage unique (vidéo non modifiée depuis génération du token)
 *
 * Si valide : passe au middleware suivant
 * Si invalide : retourne 401 ou 403 avec message d'erreur
 */

/**
 * Middleware de validation du token d'édition
 *
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction suivante
 *
 * Usage dans une route :
 * router.put('/:id/update', validateEditTokenMiddleware, controller.update)
 */
export const validateEditTokenMiddleware = async (req, res, next) => {
  try {
    const videoId = req.params.id;

    if (!videoId) {
      return res.status(400).json({
        success: false,
        message: 'ID de vidéo manquant'
      });
    }

    // 1. Extraire le token depuis la requête
    const token = extractTokenFromRequest(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de modification manquant',
        hint: 'Le lien de modification doit contenir un token valide. Veuillez utiliser le lien reçu par email.'
      });
    }

    // 2. Récupérer la vidéo depuis la DB
    const video = await videoModel.findById(videoId);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Vidéo non trouvée'
      });
    }

    // 3. Valider le token (signature + expiration + usage unique)
    const validation = validateEditToken(token, video);

    if (!validation.valid) {
      console.warn(`[MIDDLEWARE] Token invalide pour vidéo ${videoId}:`, validation.reason);

      return res.status(403).json({
        success: false,
        message: 'Token de modification invalide ou expiré',
        reason: validation.reason,
        hint: 'Le lien de modification a peut-être expiré (24h) ou a déjà été utilisé. Contactez l\'équipe MarsAI pour obtenir un nouveau lien.'
      });
    }

    // 4. Token valide : attacher les données au req pour les middlewares suivants
    req.editToken = {
      decoded: validation.decoded,
      video: video
    };

    console.log(`[MIDDLEWARE] Token valide pour vidéo ${videoId}`);
    next();

  } catch (error) {
    console.error('[MIDDLEWARE ERROR] Erreur validation token:', error);

    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la validation du token',
      error: error.message
    });
  }
};

/**
 * Middleware optionnel : permet la modification AVEC ou SANS token
 * Utile pour les routes admin qui peuvent modifier sans token
 *
 * Si token présent : valide le token
 * Si token absent : vérifie que l'utilisateur est admin (via req.user)
 */
export const validateEditTokenOrAdmin = async (req, res, next) => {
  const token = extractTokenFromRequest(req);

  // Si token présent, utiliser la validation normale
  if (token) {
    return validateEditTokenMiddleware(req, res, next);
  }

  // Sinon, vérifier que l'utilisateur est admin
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'superadmin')) {
    return res.status(403).json({
      success: false,
      message: 'Accès refusé : token de modification ou droits admin requis'
    });
  }

  // Admin authentifié sans token : autoriser
  console.log(`[MIDDLEWARE] Modification admin sans token par user ${req.user.id}`);
  next();
};

/**
 * Middleware pour valider uniquement la présence et validité du token
 * (sans vérifier l'usage unique)
 *
 * Utile pour la route de prévisualisation des données (GET)
 */
export const validateEditTokenOnly = (req, res, next) => {
  const token = extractTokenFromRequest(req);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token de modification manquant'
    });
  }

  const { verifyEditToken } = require('../utils/editToken.util.js');
  const decoded = verifyEditToken(token);

  if (!decoded) {
    return res.status(403).json({
      success: false,
      message: 'Token invalide ou expiré'
    });
  }

  req.editToken = { decoded };
  next();
};

// ========================================
// EXPORTS
// ========================================

export default {
  validateEditTokenMiddleware,
  validateEditTokenOrAdmin,
  validateEditTokenOnly
};
