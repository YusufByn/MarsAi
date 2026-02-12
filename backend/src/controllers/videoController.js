// videoController.js
import { pool } from '../db/index.js';

/**
 * Fonction helper pour gérer les erreurs
 * @param {Object} res - Objet response Express
 * @param {Error} error - Erreur capturée
 * @param {String} field - Champ concerné (optionnel)
 */
const handleError = (res, error, field = null) => {
    console.error(error);
    return res.status(500).json({
        success: false,
        error: error.message || 'Erreur serveur',
        ...(field && { field })
    });
};

/**
 * Fonction helper pour valider les champs obligatoires
 * @param {Object} data - Données à valider
 * @param {Array} requiredFields - Liste des champs obligatoires
 * @returns {Object} Résultat de la validation
 */
const validateRequired = (data, requiredFields) => {
    const missing = requiredFields.filter(field => !data[field]);
    if (missing.length > 0) {
        return {
            valid: false,
            field: missing[0],
            message: `Le champ ${missing[0]} est obligatoire`
        };
    }
    return { valid: true };
};

/**
 * Créer une nouvelle vidéo
 * - Crée un user si n'existe pas (basé sur l'email)
 * - Insère la vidéo avec toutes les métadonnées
 * @route POST /api/upload/videos
 */
const createVideo = async (req, res) => {
    try {
        const data = req.body;
        
        // 1. Validation des champs obligatoires
        const validation = validateRequired(data, ['email', 'rights_accepted']);
        if (!validation.valid) {
            return res.status(400).json({
                success: false,
                error: validation.message,
                field: validation.field
            });
        }
        
        // Vérifier que rights_accepted = 1
        if (data.rights_accepted !== 1 && data.rights_accepted !== '1') {
            return res.status(400).json({
                success: false,
                error: 'Vous devez accepter les droits de cession',
                field: 'rights_accepted'
            });
        }
        
        // 2. Gestion du user (créer si n'existe pas)
        const [existingUsers] = await pool.execute(
            'SELECT id FROM user WHERE email = ?',
            [data.email]
        );

        let userId;

        if (existingUsers.length > 0) {
            // User existe déjà
            userId = existingUsers[0].id;
        } else {
            // Créer un nouveau user
            const [userResult] = await pool.execute(
                `INSERT INTO user (email, name, lastname, role) 
                 VALUES (?, ?, ?, 'user')`,
                [
                    data.email,
                    data.realisator_name || '',
                    data.realisator_lastname || ''
                ]
            );
            userId = userResult.insertId;
        }
        
        // 3. Créer la vidéo
        const [videoResult] = await pool.execute(
            `INSERT INTO video (
                user_id, title, title_en, synopsis, synopsis_en,
                language, country, duration, classification,
                tech_resume, creative_resume,
                realisator_name, realisator_lastname, realisator_gender,
                email, birthday, mobile_number, fixe_number, address,
                acquisition_source, rights_accepted
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                userId,
                data.title || '',  // Utiliser une chaîne vide au lieu de null
                data.title_en || null,
                data.synopsis || null,
                data.synopsis_en || null,
                data.language || null,
                data.country || null,
                data.duration || null,
                data.classification || 'hybrid',
                data.tech_resume || null,
                data.creative_resume || null,
                data.realisator_name || null,
                data.realisator_lastname || null,
                data.realisator_gender || null,
                data.email,
                data.birthday || null,
                data.mobile_number || null,
                data.fixe_number || null,
                data.address || null,
                data.acquisition_source || null,
                data.rights_accepted
            ]
        );

        const videoId = videoResult.insertId;
        
        // 4. Récupérer la vidéo créée
        const [videos] = await pool.execute(
            'SELECT * FROM video WHERE id = ?',
            [videoId]
        );

        // 5. Retourner la vidéo complète
        return res.status(201).json({
            success: true,
            video: videos[0]
        });
        
    } catch (error) {
        return handleError(res, error);
    }
};

/**
 * Ajouter des contributeurs à une vidéo
 * @route POST /api/upload/videos/:id/contributors
 */
const addContributors = async (req, res) => {
    try {
        const { id } = req.params;
        const { contributors } = req.body;
        
        // Validation
        if (!contributors || !Array.isArray(contributors)) {
            return res.status(400).json({
                success: false,
                error: 'Format invalide, attendu: { contributors: [...] }',
                field: 'contributors'
            });
        }
        
        // Vérifier que la vidéo existe
        const [videos] = await pool.execute(
            'SELECT id FROM video WHERE id = ?',
            [id]
        );
        
        if (videos.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Vidéo non trouvée'
            });
        }
        
        // Insérer les contributeurs
        for (const contributor of contributors) {
            // Supporter les deux formats: frontend (firstName/lastName) et backend (name/last_name)
            const name = contributor.name || contributor.firstName;
            const lastName = contributor.last_name || contributor.lastName;
            const productionRole = contributor.production_role || contributor.productionRole;
            
            // Validation des champs obligatoires
            if (!name || !lastName) {
                return res.status(400).json({
                    success: false,
                    error: 'Champs firstName et lastName obligatoires pour chaque contributeur',
                    field: 'contributors'
                });
            }
            
            await pool.execute(
                `INSERT INTO contributor (video_id, name, last_name, gender, email, production_role)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    id,
                    name,
                    lastName,
                    contributor.gender || null,
                    contributor.email || null,
                    productionRole || null
                ]
            );
        }
        
        // Récupérer tous les contributeurs de cette vidéo
        const [allContributors] = await pool.execute(
            'SELECT * FROM contributor WHERE video_id = ?',
            [id]
        );
        
        return res.status(201).json({
            success: true,
            contributors: allContributors
        });
        
    } catch (error) {
        return handleError(res, error);
    }
};

/**
 * Ajouter des liens réseaux sociaux à une vidéo
 * @route POST /api/upload/videos/:id/social-media
 */
const addSocialMedia = async (req, res) => {
    try {
        const { id } = req.params;
        const { social_media } = req.body;
        
        // Validation
        if (!social_media || !Array.isArray(social_media)) {
            return res.status(400).json({
                success: false,
                error: 'Format invalide, attendu: { social_media: [...] }',
                field: 'social_media'
            });
        }
        
        // Vérifier que la vidéo existe
        const [videos] = await pool.execute(
            'SELECT id FROM video WHERE id = ?',
            [id]
        );
        
        if (videos.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Vidéo non trouvée'
            });
        }
        
        // Insérer les liens sociaux
        const insertedLinks = [];
        
        for (const link of social_media) {
            // Validation
            if (!link.platform || !link.url) {
                return res.status(400).json({
                    success: false,
                    error: 'Champs platform et url obligatoires',
                    field: 'social_media'
                });
            }
            
            // 1. Créer l'entrée dans social_media
            const [socialResult] = await pool.execute(
                'INSERT INTO social_media (platform, url) VALUES (?, ?)',
                [link.platform, link.url]
            );
            
            const socialMediaId = socialResult.insertId;
            
            // 2. Lier à la vidéo dans video_social_media
            await pool.execute(
                'INSERT INTO video_social_media (video_id, social_media_id) VALUES (?, ?)',
                [id, socialMediaId]
            );
            
            insertedLinks.push({
                id: socialMediaId,
                platform: link.platform,
                url: link.url
            });
        }
        
        return res.status(201).json({
            success: true,
            social_media: insertedLinks
        });
        
    } catch (error) {
        return handleError(res, error);
    }
};

// Export des fonctions
export default {
    createVideo,
    addContributors,
    addSocialMedia
};
