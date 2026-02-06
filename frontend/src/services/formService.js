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

// Schémas Zod pour la validation des champs d'authentification
import { juryRegisterSchema, juryLoginSchema } from '../../../shared/validators/auth.validator.js';

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
        // Retourne le premier message d'erreur Zod
        return error.errors[0].message;
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
 * Valide le prénom
 * Utilise le schéma Zod (min 2 caractères, trim automatique)
 * 
 * @param {string} value - Le prénom à valider
 * @returns {string|null} - null si valide, sinon message d'erreur Zod
 */
function validateFirstName(value) {
    return validateWithZod(juryRegisterSchema.shape.firstName, value);
};

/**
 * Valide le nom de famille
 * Utilise le schéma Zod (min 2 caractères, trim automatique)
 * 
 * @param {string} value - Le nom à valider
 * @returns {string|null} - null si valide, sinon message d'erreur Zod
 */
function validateLastName(value) {
    return validateWithZod(juryRegisterSchema.shape.lastName, value);
};

/**
 * Valide l'adresse email
 * Utilise le schéma Zod (format email, trim, lowercase automatique)
 * 
 * @param {string} value - L'email à valider
 * @returns {string|null} - null si valide, sinon message d'erreur Zod
 */
function validateEmail(value) {
    return validateWithZod(juryRegisterSchema.shape.email, value);
};

/**
 * Valide le pays
 * 
 * @param {string} value - Le pays à valider
 * @returns {string|null} - null si valide, sinon message d'erreur
 */
function validateCountry(value) {
    if (!value) {
        return "Country is required";        
    }
    return null; // Validation réussie
};

/**
 * Valide l'adresse postale
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
    return null; // Validation réussie
};

/**
 * Valide la source d'acquisition (comment l'utilisateur a entendu parler de nous)
 * 
 * @param {string} value - La source d'acquisition
 * @returns {string|null} - null si valide, sinon message d'erreur
 */
function validateAcquisitionSource(value) {
    if (!value) {
        return "Please tell us how you heard about us";
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
 * Valide le numéro de téléphone fixe
 * Utilise la librairie react-phone-number-input pour valider le format international
 * 
 * Format attendu: format international avec indicatif pays (ex: +33612345678)
 * 
 * @param {string} value - Le numéro de téléphone à valider (format international)
 * @returns {string|null} - null si valide, sinon message d'erreur
 */
function validatePhoneNumber(value) {
    // Vérifie que le champ n'est pas vide
    if (!value || value.trim() === '') {
        return "Phone number is required";
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
    validateGender,           // Validation du genre (women/man/other)
    validateFirstName,        // Validation du prénom (Zod - min 2 caractères)
    validateLastName,         // Validation du nom (Zod - min 2 caractères)
    validateEmail,            // Validation de l'email (Zod - format email)
    validateCountry,          // Validation du pays (obligatoire)
    validateAddress,          // Validation de l'adresse (min 5 caractères)
    validateAcquisitionSource, // Validation de la source d'acquisition
    validateAgeVerification,  // Validation de l'âge 18+ (checkbox)
    validatePhoneNumber,      // Validation du téléphone fixe (format international)
    validateMobileNumber      // Validation du mobile (format international)
};