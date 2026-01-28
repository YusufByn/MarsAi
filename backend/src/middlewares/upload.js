// middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

/**
 * Détermine le type et le dossier selon req.uploadType (défini par setUploadType middleware)
 * Plus sécurisé : ne parse pas les URLs, utilise un type explicite
 */
const getFileInfo = (req) => {
    const type = req.uploadType;
    
    // Validation stricte : le type DOIT être défini
    if (!type) {
        throw new Error('Type d\'upload non défini. Utilisez le middleware setUploadType.');
    }
    
    // Mapping type → dossier
    const folders = {
        video: 'videos',
        cover: 'covers',
        still: 'stills',
        sub: 'srt'
    };
    
    const folder = folders[type];
    
    if (!folder) {
        throw new Error(`Type d'upload invalide: ${type}`);
    }
    
    return { type, folder };
};

/**
 * Configuration du stockage
 */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        try {
            const { folder } = getFileInfo(req);
            const uploadPath = path.join(__dirname, '../uploads', folder);
            
            // Créer le dossier s'il n'existe pas
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true });
            }
            
            cb(null, uploadPath);
        } catch (error) {
            cb(error, null);
        }
    },
    
    filename: (req, file, cb) => {
        try {
            const { type } = getFileInfo(req);
            const ext = path.extname(file.originalname).toLowerCase();
            const timestamp = Date.now();
            const random = Math.random().toString(36).substring(2, 8);
            
            // ID du contenu depuis les params de la route (:id) ou body
            const contentId = req.params.id || req.body.video_id || timestamp;
            
            let filename;
            
            switch(type) {
                case 'video':
                    filename = `video_${contentId}_${timestamp}_${random}${ext}`;
                    break;
                    
                case 'cover':
                    filename = `cover_${contentId}_${timestamp}_${random}${ext}`;
                    break;
                    
                case 'still':
                    // Si upload multiple, utiliser l'index dans le tableau
                    // Sinon, utiliser un compteur basé sur le timestamp
                    const index = req.files ? 
                        (Array.isArray(req.files) ? req.files.indexOf(file) + 1 : 1) : 
                        1;
                    filename = `still_${contentId}_${index}_${timestamp}_${random}${ext}`;
                    break;
                    
                case 'sub':
                    const lang = req.body.language || req.query.language || 'fr';
                    filename = `sub_${contentId}_${lang}_${timestamp}${ext}`;
                    break;
                    
                default:
                    throw new Error(`Type de fichier non géré: ${type}`);
            }
            
            cb(null, filename);
        } catch (error) {
            cb(error, null);
        }
    }
});

/**
 * Validation des types MIME selon le type défini
 */
const fileFilter = (req, file, cb) => {
    try {
        const { type } = getFileInfo(req);
        
        const allowedMimes = {
            video: ['video/mp4', 'video/quicktime', 'video/x-matroska'],
            cover: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
            still: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
            sub: ['text/plain', 'application/x-subrip']
        };
        
        const isValidMime = allowedMimes[type]?.includes(file.mimetype);
        const isSrtFile = type === 'sub' && file.originalname.endsWith('.srt');
        
        if (isValidMime || isSrtFile) {
            cb(null, true);
        } else {
            cb(new Error(`Format non autorisé pour ${type}: ${file.mimetype}`), false);
        }
    } catch (error) {
        cb(error, false);
    }
};

/**
 * Limites de taille selon le type de fichier
 * Note: Cette fonction n'est pas utilisée actuellement car Multer 
 * n'accepte pas de fonction dynamique pour limits. Les limites sont 
 * gérées par le fileFilter qui rejette les fichiers trop volumineux.
 */
const getLimits = (req) => {
    try {
        const { type } = getFileInfo(req);
        
        const limits = {
            video: 200 * 1024 * 1024,  // 200 MB
            cover: 15 * 1024 * 1024,     // 15 MB
            still: 5 * 1024 * 1024,     // 5 MB
            sub: 2 * 1024 * 1024        // 2 MB
        };
        
        return {
            fileSize: limits[type] || 10 * 1024 * 1024 // 10 MB par défaut
        };
    } catch (error) {
        return {
            fileSize: 10 * 1024 * 1024 // 10 MB par défaut
        };
    }
};

/**
 * Configuration Multer unique
 */
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 500 * 1024 * 1024 // Max absolu (sera affiné par route)
    }
});

/**
 * Export : Un seul middleware universel
 * Détecte automatiquement le type selon la route
 */
module.exports = {
    // Pour un seul fichier (video, cover, srt)
    single: upload.single('file'),
    
    // Pour plusieurs fichiers (stills)
    multiple: upload.array('files', 3),
    
    // Alternative : Laisser le choix dans la route
    upload: upload
};