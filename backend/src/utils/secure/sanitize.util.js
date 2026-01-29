// fonctions pour sanitiser des strings et une fonction anti xss

// fonction pour sanittiser une string anti xss
export const sanitizeString = (value) => {
    if (typeof value !== "string") return value;
    return value.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  };
  
// fonction pour trimmer une string
export const normalizeString = (value) => {
    if (typeof value !== "string") return value;
    return value.trim();
};
  
// fonction pour normaliser une email et la mettre en minuscule
export const normalizeEmail = (value) => {
    if (typeof value !== "string") return value;
    return value.trim().toLowerCase();
};