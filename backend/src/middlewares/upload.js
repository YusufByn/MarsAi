// middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const VALID_TYPES = ['video', 'cover', 'still', 'sub'];

/**
 * Crée un middleware d'upload sécurisé pour un type spécifique
 * @param {string} type - Type de fichier (video, cover, still, sub)
 * @returns {Array} Tableau de middlewares [setType, multerMiddleware]
 */
const createUploadMiddleware = (type) => {
    // Valider le type à la création
    if (!VALID_TYPES.includes(type)) {
        throw new Error(`Type d'upload invalide: ${type}. Types autorisés: ${VALID_TYPES.join(', ')}`);
    }
    
    // Middleware pour définir le type dans req
    const setType = (req, res, next) => {
        req.uploadType = type;
        next();
    };

    // Mapping type → dossier
    const folders = {
        video: 'videos',
        cover: 'covers',
        still: 'stills',
        sub: 'srt'
    };
    
    // Configuration du stockage
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            try {
                const uploadPath = path.join(__dirname, '../uploads', folders[type]);
                
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
                const ext = path.extname(file.originalname).toLowerCase();
                const timestamp = Date.now();
                const random = Math.random().toString(36).substring(2, 8);
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

    // Validation des types MIME
    const allowedMimes = {
        video: ['video/mp4', 'video/quicktime', 'video/x-matroska'],
        cover: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
        still: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
        sub: ['text/plain', 'application/x-subrip']
    };
    
    const fileFilter = (req, file, cb) => {
        try {
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

    // Limites de taille selon le type
    const limits = {
        video: 200 * 1024 * 1024,  // 200 MB
        cover: 15 * 1024 * 1024,   // 15 MB
        still: 5 * 1024 * 1024,    // 5 MB
        sub: 2 * 1024 * 1024       // 2 MB
    };
    
    // Configuration Multer
    const upload = multer({
        storage: storage,
        fileFilter: fileFilter,
        limits: {
            fileSize: limits[type] || 10 * 1024 * 1024
        }
    });
    
    // Retourner le middleware approprié selon le type
    const multerMiddleware = type === 'still' 
        ? upload.array('files', 3)
        : upload.single('file');
    
    // Retourner les deux middlewares dans l'ordre
    return [setType, multerMiddleware];
};

/**
 * Export des middlewares pré-configurés par type
 * Usage: upload.video, upload.cover, upload.still, upload.sub
 */
module.exports = {
    video: createUploadMiddleware('video'),
    cover: createUploadMiddleware('cover'),
    still: createUploadMiddleware('still'),
    sub: createUploadMiddleware('sub')
};