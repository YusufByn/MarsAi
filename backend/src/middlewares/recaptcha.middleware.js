// ============================================
// RECAPTCHA MIDDLEWARE
// ============================================
// Middleware Express pour vérifier le token reCAPTCHA avant de traiter la requête

import { verifyRecaptchaToken } from '../services/recaptcha.service.js';
import { cleanupUploadedFiles } from './upload.middleware.js';

/**
 * Middleware pour vérifier le token reCAPTCHA
 * Attend le token dans req.body.recaptchaToken
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
async function verifyRecaptcha(req, res, next) {
  try {
    // Récupérer le token depuis le body de la requête
    const { recaptchaToken } = req.body;

    // Vérifier le token avec l'API Google via le service
    const result = await verifyRecaptchaToken(recaptchaToken);

    // Si la vérification échoue, retourner une erreur 400
    if (!result.success) {
      await cleanupUploadedFiles(req);
      return res.status(400).json({
        success: false,
        message: result.message,
        errors: result.errors || []
      });
    }

    // Token valide, on continue vers le prochain middleware/controller
    next();
    
  } catch (error) {
    console.error('[RECAPTCHA ERROR] Erreur middleware:', error);
    await cleanupUploadedFiles(req);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during reCAPTCHA verification'
    });
  }
}

export { verifyRecaptcha };
