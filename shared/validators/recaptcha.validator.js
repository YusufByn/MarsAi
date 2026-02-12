// ============================================
// RECAPTCHA VALIDATOR
// ============================================
// Ce validateur vérifie que le token reCAPTCHA existe
// Il est utilisé côté client avant la soumission du formulaire

/**
 * Valide le token reCAPTCHA
 * 
 * @param {string} value - Le token reCAPTCHA généré par Google
 * @returns {string|null} - null si valide, sinon message d'erreur
 */
function validateRecaptcha(value) {
    if (!value || value.trim() === '') {
        return "Please verify that you are not a robot";
    }
    return null;
}

export default validateRecaptcha;