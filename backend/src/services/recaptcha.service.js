// ============================================
// RECAPTCHA SERVICE
// ============================================
// Service pour vérifier les tokens reCAPTCHA avec l'API Google

import axios from 'axios';

/**
 * Vérifie le token reCAPTCHA auprès de l'API Google
 * 
 * @param {string} token - Le token généré côté client par reCAPTCHA
 * @returns {Promise<Object>} - { success: boolean, message: string, errors?: array }
 */
async function verifyRecaptchaToken(token) {
  // Vérifier que le token existe
  if (!token || token.trim() === '') {
    return {
      success: false,
      message: 'reCAPTCHA token is missing'
    };
  }

  try {
    // Récupérer la clé secrète depuis les variables d'environnement
    const secretKey = process.env.GOOGLE_RECAPTCHA_SECRET_KEY;
    
    if (!secretKey) {
      console.error('❌ GOOGLE_RECAPTCHA_SECRET_KEY is not defined in .env');
      return {
        success: false,
        message: 'reCAPTCHA configuration error'
      };
    }

    // URL de vérification de Google reCAPTCHA
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;
    
    // Appel à l'API Google
    const response = await axios.post(verificationUrl);
    
    // Google retourne { success: true/false, challenge_ts, hostname, error-codes }
    if (response.data.success) {
      return {
        success: true,
        message: 'Human verified ✓'
      };
    } else {
      // Token invalide ou expiré
      const errorCodes = response.data['error-codes'] || [];
      return {
        success: false,
        message: 'Bot detected or invalid reCAPTCHA token',
        errors: errorCodes
      };
    }
  } catch (error) {
    console.error('❌ reCAPTCHA verification error:', error.message);
    return {
      success: false,
      message: 'Error verifying reCAPTCHA',
      error: error.message
    };
  }
}

export { verifyRecaptchaToken };
