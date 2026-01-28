/**
 * Middleware pour définir explicitement le type d'upload
 * Sécurise la détection du type en évitant le parsing de chaînes
 */

const VALID_TYPES = ['video', 'cover', 'still', 'sub'];

/**
 * Définit le type d'upload dans la requête
 * @param {string} type - Type de fichier attendu (video, cover, still, sub)
 * @returns {Function} Middleware Express
 */
const setUploadType = (type) => {
    return (req, res, next) => {
        // Validation du type
        if (!VALID_TYPES.includes(type)) {
            return res.status(500).json({ 
                error: 'Configuration invalide',
                message: `Type d'upload non reconnu: ${type}`
            });
        }
        
        // Définir le type dans la requête
        req.uploadType = type;
        
        next();
    };
};

module.exports = setUploadType;
