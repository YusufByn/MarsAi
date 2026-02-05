// imports des outils middlewares pour certaine vérification
// Dans frontend/src/services/formService.js
import { juryRegisterSchema, juryLoginSchema } from '../../../shared/validators/auth.validator.js';

// ce service effectu toute les vérifications du formulaire

// Personnal Data

function validateGender(value) {
    if (!value) {
        return "Gender is required";
    } else if (!["women","man","other"].includes(value)) {
        return "Invalid gender";
    }
    return null;
};


function validateFirstName(value) {
    if (!value) {
        return "First name is required";
    } else if (value.length < 2) {
        return "First name must be at least 2 characters";
    }
    return null;
};


function validateLastName(value) {
    if (!value) {
        return "Last name is required";
    } else if (value.length < 2) {
        return "Last name must be at least 2 characters";
    }
    return null;
};


function validateEmail(value) {
    if (!value) {
        return "Email is required";
    } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
        return "Invalid email format";        
    }
    return null;
};


function validateCountry(value) {
    if (!value) {
        return "Country is required";        
    }
    return null;
};

function validateAddress(value) {
    if (!value) {
        return "Address is required";
    } else if (value.length < 5) {
        return "Address must be at least 5 characters";        
    }
    return null;
};

function validateAcquisitionSource(value) {
    if (!value) {
        return "Please tell us how you heard about us";
    }
    return null;
};

// Export des fonctions
export {
    validateGender,
    validateFirstName,
    validateLastName,
    validateEmail,
    validateCountry,
    validateAddress,
    validateAcquisitionSource
};