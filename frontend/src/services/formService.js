/**
 * SERVICE DE VALIDATION DES FORMULAIRES
 * 
 * Ce service centralise toutes les fonctions de validation pour les formulaires de l'application.
 * Il utilise Zod pour certaines validations (email, firstName, lastName) et des validations custom pour les autres.
 * 
 * Toutes les fonctions retournent :
 * - null si la validation réussit
 * - une chaîne de caractères (message d'erreur) si la validation échoue
 */

// ============================================
// IMPORTS
// ============================================

// Schémas Zod pour la validation des champs du formulaire de participation
import { 
    firstNameSchema, 
    lastNameSchema, 
    emailSchema 
} from '../../../shared/validators/form.validator.js';

// Fonction de validation des numéros de téléphone internationaux
import { isValidPhoneNumber } from 'react-phone-number-input';


// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Fonction helper pour valider un champ avec Zod
 * 
 * @param {Object} schemaField - Le champ Zod à utiliser pour la validation (ex: juryRegisterSchema.shape.email)
 * @param {any} value - La valeur à valider
 * @returns {string|null} - null si valide, sinon le message d'erreur Zod
 */
function validateWithZod(schemaField, value) {
    try {
        // Parse la valeur avec le schéma Zod
        schemaField.parse(value);
        return null; // Validation réussie
    } catch (error) {
        // Zod utilise 'issues' pour stocker les erreurs
        if (error.issues && error.issues.length > 0) {
            return error.issues[0].message;
        }
        // Fallback en cas d'erreur inattendue
        return "Validation error";
    }
}

// ============================================
// VALIDATION DES DONNÉES PERSONNELLES
// ============================================

/**
 * Valide le champ genre/civilité
 * 
 * @param {string} value - La valeur du genre ("women", "man", ou "other")
 * @returns {string|null} - null si valide, sinon message d'erreur
 */
function validateGender(value) {
    // Vérifie que le champ n'est pas vide
    if (!value) {
        return "Gender is required";
    } 
    // Vérifie que la valeur fait partie des options autorisées
    else if (!["women","man","other"].includes(value)) {
        return "Invalid gender";
    }
    return null; // Validation réussie
};

/**
 * Valide que la valeur contient uniquement des lettres, espaces, tirets et apostrophes
 * Utilisé pour firstName, lastName, country
 * 
 * @param {string} value - La valeur à valider
 * @param {string} fieldName - Le nom du champ (pour le message d'erreur)
 * @returns {string|null} - null si valide, sinon message d'erreur
 */
function validateNameFormat(value, fieldName) {
    // Pattern pour lettres (avec accents), espaces, tirets et apostrophes uniquement
    const namePattern = /^[a-zA-ZÀ-ÿ\s'-]+$/;
    
    if (!namePattern.test(value)) {
        return `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`;
    }
    return null;
};

/**
 * Valide le prénom
 * Utilise le schéma Zod (min 2 caractères, max 50 caractères, trim automatique)
 * + validation des caractères autorisés
 * 
 * @param {string} value - Le prénom à valider
 * @returns {string|null} - null si valide, sinon message d'erreur
 */
function validateFirstName(value) {
    // Validation Zod (longueur)
    const zodError = validateWithZod(firstNameSchema, value);
    if (zodError) return zodError;
    
    // Validation des caractères autorisés
    return validateNameFormat(value, "First name");
};

/**
 * Valide le nom de famille
 * Utilise le schéma Zod (min 2 caractères, max 50 caractères, trim automatique)
 * + validation des caractères autorisés
 * 
 * @param {string} value - Le nom à valider
 * @returns {string|null} - null si valide, sinon message d'erreur
 */
function validateLastName(value) {
    // Validation Zod (longueur)
    const zodError = validateWithZod(lastNameSchema, value);
    if (zodError) return zodError;
    
    // Validation des caractères autorisés
    return validateNameFormat(value, "Last name");
};

/**
 * Valide l'adresse email
 * Utilise le schéma Zod (format email, max 100 caractères, trim, lowercase automatique)
 * 
 * @param {string} value - L'email à valider
 * @returns {string|null} - null si valide, sinon message d'erreur Zod
 */
function validateEmail(value) {
    return validateWithZod(emailSchema, value);
};

/**
 * Valide le pays
 * Vérifie que le champ est rempli et contient uniquement des caractères valides
 * 
 * @param {string} value - Le pays à valider
 * @returns {string|null} - null si valide, sinon message d'erreur
 */
function validateCountry(value) {
    if (!value) {
        return "Country is required";        
    }
    
    // Validation des caractères autorisés
    return validateNameFormat(value, "Country");
};

/**
 * Valide l'adresse postale
 * Accepte les lettres, chiffres, espaces, virgules, points, tirets et apostrophes
 * 
 * @param {string} value - L'adresse à valider
 * @returns {string|null} - null si valide, sinon message d'erreur
 */
function validateAddress(value) {
    // Vérifie que le champ n'est pas vide
    if (!value) {
        return "Address is required";
    } 
    // Vérifie que l'adresse contient au moins 5 caractères
    else if (value.length < 5) {
        return "Address must be at least 5 characters";        
    }
    // Vérifie que l'adresse contient uniquement des caractères valides
    else if (value.length > 200) {
        return "Address must not exceed 200 characters";
    }
    
    // Pattern pour adresse (lettres, chiffres, virgules, points, tirets, apostrophes)
    const addressPattern = /^[a-zA-Z0-9À-ÿ\s',.-]+$/;
    if (!addressPattern.test(value)) {
        return "Address contains invalid characters";
    }
    
    return null; // Validation réussie
};

/**
 * Valide la source d'acquisition (comment l'utilisateur a entendu parler de nous)
 * Accepte les lettres, chiffres, espaces et ponctuation basique
 * 
 * @param {string} value - La source d'acquisition
 * @returns {string|null} - null si valide, sinon message d'erreur
 */
function validateAcquisitionSource(value) {
    if (!value) {
        return "Please tell us how you heard about us";
    }
    
    // Vérifie la longueur maximale
    if (value.length > 100) {
        return "Response is too long";
    }
    
    // Pattern pour acquisition source (lettres, chiffres, ponctuation basique)
    const sourcePattern = /^[a-zA-Z0-9À-ÿ\s',.()-]+$/;
    if (!sourcePattern.test(value)) {
        return "Invalid characters in response";
    }
    
    return null; // Validation réussie
};

/**
 * Valide la vérification d'âge (checkbox 18+)
 * 
 * @param {boolean} value - true si l'utilisateur a coché, false sinon
 * @returns {string|null} - null si valide, sinon message d'erreur
 */
function validateAgeVerification(value) {
    if (!value) {
        return "You must confirm that you are 18 years or older";
    }
    return null; // Validation réussie
};

// ============================================
// VALIDATION DES NUMÉROS DE TÉLÉPHONE
// ============================================

/**
 * Valide le numéro de téléphone fixe (OPTIONNEL)
 * Utilise la librairie react-phone-number-input pour valider le format international
 * 
 * Format attendu: format international avec indicatif pays (ex: +33612345678)
 * 
 * @param {string} value - Le numéro de téléphone à valider (format international)
 * @returns {string|null} - null si valide ou vide, sinon message d'erreur
 */
function validatePhoneNumber(value) {
    // Si le champ est vide, c'est valide (champ optionnel)
    if (!value || value.trim() === '') {
        return null;
    }
    
    try {
        // Utilise isValidPhoneNumber pour valider le format international
        if (!isValidPhoneNumber(value)) {
            return "Invalid phone number format";
        }
        return null; // Validation réussie
    } catch (error) {
        // En cas d'erreur de parsing, retourne un message d'erreur
        return "Invalid phone number format";
    }
};

/**
 * Valide le numéro de téléphone mobile
 * Utilise la librairie react-phone-number-input pour valider le format international
 * 
 * Format attendu: format international avec indicatif pays (ex: +33612345678)
 * 
 * @param {string} value - Le numéro mobile à valider (format international)
 * @returns {string|null} - null si valide, sinon message d'erreur
 */
function validateMobileNumber(value) {
    // Vérifie que le champ n'est pas vide
    if (!value || value.trim() === '') {
        return "Mobile number is required";
    }
    
    try {
        // Utilise isValidPhoneNumber pour valider le format international
        if (!isValidPhoneNumber(value)) {
            return "Invalid mobile number format";
        }
        return null; // Validation réussie
    } catch (error) {
        // En cas d'erreur de parsing, retourne un message d'erreur
        return "Invalid mobile number format";
    }
};

// ============================================
// VALIDATION DES DONNÉES VIDÉO
// ============================================

/**
 * Valide le titre de la vidéo (OPTIONNEL)
 * Accepte lettres, chiffres, espaces et ponctuation basique
 * 
 * @param {string} value - Le titre à valider
 * @returns {string|null} - null si valide, sinon message d'erreur
 */
function validateTitle(value) {
    // Si le champ est vide, c'est valide (champ optionnel)
    if (!value || value.trim() === '') {
        return null;
    }
    
    if (value.length < 2) {
        return "Title must be at least 2 characters";
    }
    
    if (value.length > 255) {
        return "Title must not exceed 255 characters";
    }
    
    // Pattern pour titre (lettres, chiffres, ponctuation basique)
    const titlePattern = /^[a-zA-Z0-9À-ÿ\s',.!?:()-]+$/;
    if (!titlePattern.test(value)) {
        return "Title contains invalid characters";
    }
    
    return null;
};

/**
 * Valide le titre EN (OBLIGATOIRE)
 * Accepte lettres, chiffres, espaces et ponctuation basique
 * 
 * @param {string} value - Le titre EN à valider
 * @returns {string|null} - null si valide, sinon message d'erreur
 */
function validateTitleEN(value) {
    if (!value || value.trim() === '') {
        return "Title EN is required";
    }
    
    if (value.length < 2) {
        return "Title EN must be at least 2 characters";
    }
    
    if (value.length > 255) {
        return "Title EN must not exceed 255 characters";
    }
    
    // Pattern pour titre (lettres, chiffres, ponctuation basique)
    const titlePattern = /^[a-zA-Z0-9À-ÿ\s',.!?:()-]+$/;
    if (!titlePattern.test(value)) {
        return "Title EN contains invalid characters";
    }
    
    return null;
};

/**
 * Valide la langue
 * Accepte uniquement des lettres
 * 
 * @param {string} value - La langue à valider
 * @returns {string|null} - null si valide, sinon message d'erreur
 */
function validateLanguage(value) {
    if (!value || value.trim() === '') {
        return "Language is required";
    }
    
    if (value.length < 2) {
        return "Language must be at least 2 characters";
    }
    
    if (value.length > 50) {
        return "Language must not exceed 50 characters";
    }
    
    // Pattern pour langue (lettres uniquement)
    const languagePattern = /^[a-zA-ZÀ-ÿ\s-]+$/;
    if (!languagePattern.test(value)) {
        return "Language can only contain letters";
    }
    
    return null;
};

/**
 * Valide le synopsis (OPTIONNEL)
 * Accepte lettres, chiffres et toute ponctuation
 * 
 * @param {string} value - Le synopsis à valider
 * @returns {string|null} - null si valide, sinon message d'erreur
 */
function validateSynopsis(value) {
    // Si le champ est vide, c'est valide (champ optionnel)
    if (!value || value.trim() === '') {
        return null;
    }
    
    if (value.length < 10) {
        return "Synopsis must be at least 10 characters";
    }
    
    if (value.length > 500) {
        return "Synopsis must not exceed 500 characters";
    }
    
    return null;
};

/**
 * Valide le synopsis EN (OBLIGATOIRE)
 * Accepte lettres, chiffres et toute ponctuation
 * 
 * @param {string} value - Le synopsis EN à valider
 * @returns {string|null} - null si valide, sinon message d'erreur
 */
function validateSynopsisEN(value) {
    if (!value || value.trim() === '') {
        return "Synopsis EN is required";
    }
    
    if (value.length < 10) {
        return "Synopsis EN must be at least 10 characters";
    }
    
    if (value.length > 500) {
        return "Synopsis EN must not exceed 500 characters";
    }
    
    return null;
};

/**
 * Valide le résumé technique
 * 
 * @param {string} value - Le résumé technique à valider
 * @returns {string|null} - null si valide, sinon message d'erreur
 */
function validateTechResume(value) {
    if (!value || value.trim() === '') {
        return "Technical resume is required";
    }
    
    if (value.length < 10) {
        return "Technical resume must be at least 10 characters";
    }
    
    if (value.length > 500) {
        return "Technical resume must not exceed 500 characters";
    }
    
    return null;
};

/**
 * Valide le résumé créatif
 * 
 * @param {string} value - Le résumé créatif à valider
 * @returns {string|null} - null si valide, sinon message d'erreur
 */
function validateCreativeResume(value) {
    if (!value || value.trim() === '') {
        return "Creative resume is required";
    }
    
    if (value.length < 10) {
        return "Creative resume must be at least 10 characters";
    }
    
    if (value.length > 500) {
        return "Creative resume must not exceed 500 characters";
    }
    
    return null;
};

/**
 * Valide la classification
 * 
 * @param {string} value - La classification ("hybrid" ou "ia")
 * @returns {string|null} - null si valide, sinon message d'erreur
 */
function validateClassification(value) {
    if (!value) {
        return "Classification is required";
    }
    
    if (!["hybrid", "ia"].includes(value)) {
        return "Invalid classification";
    }
    
    return null;
};

/**
 * Valide les tags (format: tableau de strings) - OPTIONNEL
 * 
 * @param {Array} value - Tableau de tags à valider
 * @returns {string|null} - null si valide, sinon message d'erreur
 */
function validateTags(value) {
    // Vérifier que c'est un tableau
    if (!Array.isArray(value)) {
        return "Tags must be an array";
    }
    
    // Si le tableau est vide, c'est valide (champ optionnel)
    if (value.length === 0) {
        return null;
    }
    
    // Maximum 10 tags
    if (value.length > 10) {
        return "Maximum 10 tags allowed";
    }
    
    // Vérifie que chaque tag contient uniquement des caractères valides
    const tagPattern = /^[a-zA-Z0-9À-ÿ-]+$/;
    for (const tag of value) {
        if (!tagPattern.test(tag)) {
            return "Tags can only contain letters, numbers, and hyphens";
        }
        if (tag.length < 2) {
            return "Each tag must be at least 2 characters";
        }
        if (tag.length > 20) {
            return "Each tag must not exceed 20 characters";
        }
    }
    
    return null;
};

    
// ============================================
// EXPORTS
// ============================================

/**
 * Export de toutes les fonctions de validation
 * 
 * Ces fonctions peuvent être utilisées dans n'importe quel composant pour valider les données du formulaire.
 * Toutes les fonctions suivent le même pattern :
 * - Paramètre : la valeur à valider
 * - Retour : null si valide, string (message d'erreur) si invalide
 */
export {
    // Validation données personnelles
    validateGender,           // Validation du genre (women/man/other)
    validateFirstName,        // Validation du prénom (Zod - min 2 caractères)
    validateLastName,         // Validation du nom (Zod - min 2 caractères)
    validateEmail,            // Validation de l'email (Zod - format email)
    validateCountry,          // Validation du pays (obligatoire)
    validateAddress,          // Validation de l'adresse (min 5 caractères)
    validateAcquisitionSource, // Validation de la source d'acquisition
    validateAgeVerification,  // Validation de l'âge 18+ (checkbox)
    validatePhoneNumber,      // Validation du téléphone fixe (format international)
    validateMobileNumber,     // Validation du mobile (format international)
    
    // Validation données vidéo
    validateTitle,            // Validation du titre (optionnel, max 255 caractères)
    validateTitleEN,          // Validation du titre EN (obligatoire, max 255 caractères)
    validateLanguage,         // Validation de la langue (lettres uniquement)
    validateSynopsis,         // Validation du synopsis (optionnel, max 500 caractères)
    validateSynopsisEN,       // Validation du synopsis EN (obligatoire, max 500 caractères)
    validateTechResume,       // Validation du résumé technique (max 500 caractères)
    validateCreativeResume,   // Validation du résumé créatif (max 500 caractères)
    validateClassification,   // Validation de la classification (hybrid/ia)
    validateTags              // Validation des tags (séparés par virgules)
};