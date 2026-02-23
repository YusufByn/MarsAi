import rateLimit from 'express-rate-limit';

// 1. Limiteur standard (Pour naviguer sur le site, lire les films, etc.)
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300, 
    message: { success: false, message: "Trop de requêtes, veuillez patienter un instant." }
});

// 2. Limiteur STRICT (Protection Brute-Force pour Login / Register)
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, 
    message: { success: false, message: "Trop de tentatives. Compte temporairement bloqué (15min)." }
});

// 3. Limiteur SOUPLE mais restrictif en quantité (Pour l'upload de vidéos/images)
export const uploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 heure
    max: 20, 
    message: { success: false, message: "Quota d'upload atteint. Veuillez réessayer plus tard." }
});

// 4. Limiteur Jury (Pour le Swipe TikTok)
export const swipeLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 100,
    message: { success: false, message: "Wow, doucement sur le swipe !" }
});