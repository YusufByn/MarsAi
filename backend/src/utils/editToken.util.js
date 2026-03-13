import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

/**
 * Utilitaires pour la génération et validation de tokens d'édition de vidéo
 *
 * Les tokens permettent aux réalisateurs de modifier leur vidéo via un lien email
 * - Validité : 24 heures
 * - Usage unique : vérifié via comparaison avec updated_at de la vidéo
 * - Pas de stockage en base de données (stateless JWT)
 */

// ========================================
// GÉNÉRATION DE TOKEN
// ========================================

/**
 * Génère un token JWT pour permettre l'édition d'une vidéo
 *
 * @param {Object} videoData - Données de la vidéo
 * @param {number} videoData.id - ID de la vidéo
 * @param {Date|string} videoData.updated_at - Date de dernière modification
 * @returns {string} Token JWT signé
 *
 * @example
 * const token = generateEditToken({ id: 123, updated_at: new Date() });
 * // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 */
export const generateEditToken = (videoData) => {
  if (!videoData.id) {
    throw new Error('Video ID is required to generate edit token');
  }

  // Convertir updated_at en timestamp pour inclusion dans le token
  const lastModified = videoData.updated_at
    ? new Date(videoData.updated_at).getTime()
    : Date.now();

  const payload = {
    video_id: videoData.id,
    purpose: 'edit',
    last_modified: lastModified, // Pour vérifier l'usage unique
    iat: Math.floor(Date.now() / 1000) // Issued at (en secondes)
  };

  // Token valide 24 heures
  const token = jwt.sign(payload, env.jwtSecret, {
    expiresIn: '24h'
  });

  console.log(`[TOKEN] Token d'édition généré pour vidéo ID: ${videoData.id}`);
  return token;
};

// ========================================
// VÉRIFICATION DE TOKEN
// ========================================

/**
 * Vérifie et décode un token d'édition
 *
 * @param {string} token - Token JWT à vérifier
 * @returns {Object|null} Payload décodé si valide, null sinon
 *
 * @example
 * const decoded = verifyEditToken(token);
 * if (decoded) {
 *   console.log('Video ID:', decoded.video_id);
 * }
 */
export const verifyEditToken = (token) => {
  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);

    // Vérifier que le token a bien le bon purpose
    if (decoded.purpose !== 'edit') {
      console.warn('[TOKEN WARNING] Token avec purpose invalide:', decoded.purpose);
      return null;
    }

    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      console.warn('[TOKEN WARNING] Token expiré');
    } else if (error.name === 'JsonWebTokenError') {
      console.warn('[TOKEN WARNING] Token invalide:', error.message);
    } else {
      console.error('[TOKEN ERROR] Erreur vérification token:', error);
    }
    return null;
  }
};

/**
 * Vérifie qu'un token est valide ET que la vidéo n'a pas été modifiée depuis
 * (Usage unique du token)
 *
 * @param {string} token - Token JWT
 * @param {Object} currentVideo - Vidéo actuelle en DB
 * @param {Date|string} currentVideo.updated_at - Date de dernière modification
 * @returns {Object} Résultat de validation { valid: boolean, reason?: string, decoded?: Object }
 *
 * @example
 * const result = validateEditToken(token, video);
 * if (result.valid) {
 *   // Token valide, autoriser la modification
 * } else {
 *   console.log('Raison:', result.reason);
 * }
 */
export const validateEditToken = (token, currentVideo) => {
  // 1. Vérifier et décoder le token
  const decoded = verifyEditToken(token);

  if (!decoded) {
    return {
      valid: false,
      reason: 'Token invalide ou expiré'
    };
  }

  // 2. Vérifier que l'ID de vidéo correspond
  if (decoded.video_id !== currentVideo.id) {
    return {
      valid: false,
      reason: 'Le token ne correspond pas à cette vidéo'
    };
  }

  // 3. Vérifier l'usage unique (la vidéo n'a pas été modifiée depuis la génération du token)
  const currentUpdatedAt = currentVideo.updated_at
    ? new Date(currentVideo.updated_at).getTime()
    : 0;

  const tokenLastModified = decoded.last_modified || 0;

  if (currentUpdatedAt > tokenLastModified) {
    return {
      valid: false,
      reason: 'Cette vidéo a déjà été modifiée. Le lien de modification a expiré. Veuillez demander un nouveau lien.'
    };
  }

  // Token valide et vidéo non modifiée depuis
  return {
    valid: true,
    decoded
  };
};

// ========================================
// UTILITAIRES
// ========================================

/**
 * Extrait le token depuis une query string, un header ou un body
 *
 * @param {Object} req - Requête Express
 * @returns {string|null} Token extrait
 */
export const extractTokenFromRequest = (req) => {
  // 1. Vérifier dans la query string (?token=...)
  if (req.query && req.query.token) {
    return req.query.token;
  }

  // 2. Vérifier dans les headers (Authorization: Bearer ...)
  if (req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      return parts[1];
    }
  }

  // 3. Vérifier dans le body
  if (req.body && req.body.token) {
    return req.body.token;
  }

  return null;
};

/**
 * Calcule le temps restant avant expiration d'un token
 *
 * @param {Object} decoded - Payload décodé du token
 * @returns {Object} { expired: boolean, hoursLeft?: number, minutesLeft?: number }
 */
export const getTokenTimeRemaining = (decoded) => {
  if (!decoded || !decoded.exp) {
    return { expired: true };
  }

  const now = Math.floor(Date.now() / 1000);
  const timeLeft = decoded.exp - now;

  if (timeLeft <= 0) {
    return { expired: true };
  }

  const hoursLeft = Math.floor(timeLeft / 3600);
  const minutesLeft = Math.floor((timeLeft % 3600) / 60);

  return {
    expired: false,
    hoursLeft,
    minutesLeft,
    secondsLeft: timeLeft
  };
};

// ========================================
// EXPORTS
// ========================================

export default {
  generateEditToken,
  verifyEditToken,
  validateEditToken,
  extractTokenFromRequest,
  getTokenTimeRemaining
};
