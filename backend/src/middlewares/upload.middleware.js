// middleware/upload.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VALID_TYPES = ['video', 'cover', 'still', 'sub'];

/**
 * Crée un middleware d'upload sécurisé pour un type spécifique
 * @param {string} type - File type (video, cover, still, sub)
 * @returns {Array} Tableau de middlewares [setType, multerMiddleware]
 */
const createUploadMiddleware = (type) => {
    // Valider le type à la création
    if (!VALID_TYPES.includes(type)) {
        throw new Error(`Invalid upload type: ${type}. Allowed types: ${VALID_TYPES.join(', ')}`);
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
                        throw new Error(`File type not handled: ${type}`);
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
                cb(new Error(`Unauthorized format for ${type}: ${file.mimetype}`), false);
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
 * Middleware combiné pour la soumission de vidéo
 * Gère l'upload simultané de : video (obligatoire), cover (obligatoire), srt (optionnel)
 */
const createVideoSubmissionMiddleware = () => {
    // Configuration du stockage pour plusieurs types de fichiers
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            try {
                let folder;

                // Déterminer le dossier selon le fieldname
                switch(file.fieldname) {
                    case 'video':
                        folder = 'videos';
                        break;
                    case 'cover':
                        folder = 'covers';
                        break;
                    case 'srt':
                        folder = 'srt';
                        break;
                    case 'stills':
                        folder = 'stills';
                        break;
                    default:
                        return cb(new Error(`Unknown field: ${file.fieldname}`), null);
                }

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
                const ext = path.extname(file.originalname).toLowerCase();
                const timestamp = Date.now();
                const random = Math.random().toString(36).substring(2, 8);

                let filename;

                switch(file.fieldname) {
                    case 'video':
                        filename = `video_${timestamp}_${random}${ext}`;
                        break;
                    case 'cover':
                        filename = `cover_${timestamp}_${random}${ext}`;
                        break;
                    case 'srt':
                        const lang = req.body.language || 'fr';
                        filename = `sub_${timestamp}_${lang}${ext}`;
                        break;
                    case 'stills':
                        // Pour les stills, ajouter un index unique
                        filename = `still_${timestamp}_${random}${ext}`;
                        break;
                    default:
                        return cb(new Error(`Unknown field: ${file.fieldname}`), null);
                }

                cb(null, filename);
            } catch (error) {
                cb(error, null);
            }
        }
    });

    // Validation des types MIME
    const fileFilter = (req, file, cb) => {
        try {
            const allowedMimes = {
                video: ['video/mp4', 'video/quicktime', 'video/x-matroska'],
                cover: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
                stills: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
                srt: ['text/plain', 'application/x-subrip']
            };

            const isValidMime = allowedMimes[file.fieldname]?.includes(file.mimetype);
            const isSrtFile = file.fieldname === 'srt' && file.originalname.endsWith('.srt');

            if (isValidMime || isSrtFile) {
                cb(null, true);
            } else {
                cb(new Error(`Unauthorized format for ${file.fieldname}: ${file.mimetype}`), false);
            }
        } catch (error) {
            cb(error, false);
        }
    };

    // Configuration Multer avec fields multiples
    const upload = multer({
        storage: storage,
        fileFilter: fileFilter,
        limits: {
            fileSize: 200 * 1024 * 1024 // Limite globale de 200 MB
        }
    });

    // Middleware pour gérer les 4 types de champs
    return upload.fields([
        { name: 'video', maxCount: 1 },
        { name: 'cover', maxCount: 1 },
        { name: 'srt', maxCount: 1 },
        { name: 'stills', maxCount: 3 }
    ]);
};

/**
 * Middleware pour attacher les noms de fichiers uploadés au body
 */
const attachFileNames = (req, res, next) => {
    if (req.files) {
        // req.files est un objet avec les fieldnames comme clés
        if (req.files.video && req.files.video[0]) {
            req.body.video_file_name = req.files.video[0].filename;
        }

        if (req.files.cover && req.files.cover[0]) {
            req.body.cover = req.files.cover[0].filename;
        }

        if (req.files.srt && req.files.srt[0]) {
            req.body.srt_file_name = req.files.srt[0].filename;
        }
    }

    next();
};

/**
 * Export des middlewares pré-configurés par type
 * Usage: upload.video, upload.cover, upload.still, upload.sub
 */
export default {
    video: createUploadMiddleware('video'),
    cover: createUploadMiddleware('cover'),
    still: createUploadMiddleware('still'),
    sub: createUploadMiddleware('sub'),
    videoSubmission: createVideoSubmissionMiddleware(),
    attachFileNames
}