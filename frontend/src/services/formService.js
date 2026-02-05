// imports des outils middlewares pour certaine vérification


// ce service effectu toute les vérifications du formulaire

// Personnal Data

function validateGender(value) {
    if (!value) {
        throw new Error("Gender is required");
    } else if (!["women","man","other"].includes(value)) {
        throw new Error("Invalid gender");
    }
};


function validateFirstName(value) {
    if (!value) {
        throw new Error("First name is required");
    } else if (value.length < 2) {
        throw new Error("First name must be at least 2 characters");
    }
};


function validateLastName(value) {
    if (!value) {
        throw new Error("Last name is required");
    } else if (value.length < 2) {
        throw new Error("Last name must be at least 2 characters");
    }
};


function validateEmail(value) {
    if (!value) {
        throw new Error("Email is required");
    } else if (value = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/) {
        throw new Error("Email format is not valide");        
    }
};


// possiblement pas nécéssaire avec un dropdown de selection de pays
function validateCountry(value) {
    if (!value) {
        throw new Error("Country is required");        
    }    
};

// phone validate

// Adress validate

function validateAdress(value) {
    if (!value) {
        throw new Error("Adress is required");
    } else if (value.length < 2) {
        throw new Error("Adress is too short");        
    }       
};