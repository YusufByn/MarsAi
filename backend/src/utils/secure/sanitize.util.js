// fonctions pour sanitiser des strings et une fonction anti xss

// fonction pour sanittiser une string anti xss
export const sanitizeString = (value) => {
    if (typeof value !== "string") return value;
    return value.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  };