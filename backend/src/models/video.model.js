import pool from '../config/db.js';

/**
 * Créer une vidéo dans la table video
 * @param {Object} videoData - Données de la vidéo
 * @returns {Promise<number>} - ID de la vidéo créée
 */
export async function createVideo(videoData) {
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();
        
        const [result] = await connection.execute(
            `INSERT INTO video (
                user_id, title, title_en, synopsis, synopsis_en,
                youtube_url, video_file_name, cover, srt_file_name,
                language, country, duration, classification,
                tech_resume, creative_resume,
                realisator_name, realisator_lastname, realisator_gender,
                email, birthday, mobile_number, fixe_number, address,
                acquisition_source, rights_accepted
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                videoData.user_id,
                videoData.title,
                videoData.title_en || null,
                videoData.synopsis,
                videoData.synopsis_en || null,
                videoData.youtube_url || null,
                videoData.video_file_name || null,
                videoData.cover || null,
                videoData.srt_file_name || null,
                videoData.language || null,
                videoData.country || null,
                videoData.duration || null,
                videoData.classification || 'hybrid',
                videoData.tech_resume || null,
                videoData.creative_resume || null,
                videoData.realisator_name || null,
                videoData.realisator_lastname || null,
                videoData.realisator_gender || null,
                videoData.email || null,
                videoData.birthday || null,
                videoData.mobile_number || null,
                videoData.fixe_number || null,
                videoData.address || null,
                videoData.acquisition_source || null,
                videoData.rights_accepted || 0
            ]
        );
        
        await connection.commit();
        return result.insertId;
        
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

/**
 * Ajouter des contributeurs à une vidéo
 * @param {number} videoId - ID de la vidéo
 * @param {Array} contributors - Tableau de contributeurs
 */
export async function addContributors(videoId, contributors) {
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();
        
        for (const contributor of contributors) {
            await connection.execute(
                `INSERT INTO contributor (video_id, name, last_name, gender, email, production_role)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    videoId,
                    contributor.name,
                    contributor.last_name,
                    contributor.gender || null,
                    contributor.email || null,
                    contributor.production_role
                ]
            );
        }
        
        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

/**
 * Ajouter des tags à une vidéo
 * @param {number} videoId - ID de la vidéo
 * @param {Array} tags - Tableau de noms de tags
 */
export async function addTags(videoId, tags) {
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();
        
        for (const tagName of tags) {
            // Créer le tag s'il n'existe pas (INSERT IGNORE)
            await connection.execute(
                `INSERT IGNORE INTO tag (name) VALUES (?)`,
                [tagName.toLowerCase().trim()]
            );
            
            // Récupérer l'ID du tag
            const [tagRows] = await connection.execute(
                `SELECT id FROM tag WHERE name = ?`,
                [tagName.toLowerCase().trim()]
            );
            
            const tagId = tagRows[0].id;
            
            // Lier le tag à la vidéo
            await connection.execute(
                `INSERT IGNORE INTO video_tag (video_id, tag_id) VALUES (?, ?)`,
                [videoId, tagId]
            );
        }
        
        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

/**
 * Ajouter des stills (images) à une vidéo
 * @param {number} videoId - ID de la vidéo
 * @param {Array} stills - Tableau de fichiers stills
 */
export async function addStills(videoId, stills) {
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();
        
        for (let i = 0; i < stills.length; i++) {
            const still = stills[i];
            await connection.execute(
                `INSERT INTO still (video_id, file_name, file_url, sort_order)
                 VALUES (?, ?, ?, ?)`,
                [
                    videoId,
                    still.filename,
                    `/uploads/stills/${still.filename}`,
                    i
                ]
            );
        }
        
        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

/**
 * Ajouter des liens social media à une vidéo
 * @param {number} videoId - ID de la vidéo
 * @param {Array} socialMediaLinks - Tableau de liens social media
 */
export async function addSocialMedia(videoId, socialMediaLinks) {
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();
        
        for (const link of socialMediaLinks) {
            // Créer l'entrée social_media
            const [result] = await connection.execute(
                `INSERT INTO social_media (platform, url) VALUES (?, ?)`,
                [link.platform, link.url]
            );
            
            const socialMediaId = result.insertId;
            
            // Lier à la vidéo
            await connection.execute(
                `INSERT INTO video_social_media (video_id, social_media_id) VALUES (?, ?)`,
                [videoId, socialMediaId]
            );
        }
        
        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

/**
 * Créer le statut admin initial (draft)
 * @param {number} videoId - ID de la vidéo
 * @param {number} userId - ID de l'utilisateur
 */
export async function createAdminStatus(videoId, userId) {
    const connection = await pool.getConnection();
    
    try {
        await connection.execute(
            `INSERT INTO admin_video (video_id, user_id, statut) VALUES (?, ?, 'draft')`,
            [videoId, userId]
        );
    } finally {
        connection.release();
    }
}

/**
 * Récupérer les vidéos d'un utilisateur avec pagination
 * @param {number} userId - ID de l'utilisateur
 * @param {number} page - Numéro de page
 * @param {number} limit - Nombre de résultats par page
 * @returns {Promise<Object>} - { videos: [], total: number }
 */
export async function getUserVideos(userId, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    
    const [videos] = await pool.execute(
        `SELECT 
            v.id,
            v.title,
            v.cover,
            v.duration,
            v.classification,
            v.created_at,
            av.statut,
            av.comment as admin_comment
         FROM video v
         LEFT JOIN admin_video av ON v.id = av.video_id
         WHERE v.user_id = ?
         ORDER BY v.created_at DESC
         LIMIT ? OFFSET ?`,
        [userId, limit, offset]
    );
    
    // Compter le total
    const [countRows] = await pool.execute(
        `SELECT COUNT(*) as total FROM video WHERE user_id = ?`,
        [userId]
    );
    
    return {
        videos,
        total: countRows[0].total
    };
}

/**
 * Récupérer une vidéo par son ID avec tous les détails
 * @param {number} videoId - ID de la vidéo
 * @returns {Promise<Object>} - Vidéo complète avec relations
 */
export async function getVideoByIdWithDetails(videoId) {
    // Récupérer la vidéo
    const [videoRows] = await pool.execute(
        `SELECT v.*, av.statut, av.comment as admin_comment
         FROM video v
         LEFT JOIN admin_video av ON v.id = av.video_id
         WHERE v.id = ?`,
        [videoId]
    );
    
    if (videoRows.length === 0) {
        return null;
    }
    
    const video = videoRows[0];
    
    // Récupérer les contributors
    const [contributors] = await pool.execute(
        `SELECT id, name, last_name, gender, email, production_role
         FROM contributor WHERE video_id = ?`,
        [videoId]
    );
    
    // Récupérer les tags
    const [tags] = await pool.execute(
        `SELECT t.id, t.name
         FROM tag t
         INNER JOIN video_tag vt ON t.id = vt.tag_id
         WHERE vt.video_id = ?`,
        [videoId]
    );
    
    // Récupérer les stills
    const [stills] = await pool.execute(
        `SELECT id, file_name, file_url, sort_order
         FROM still WHERE video_id = ?
         ORDER BY sort_order`,
        [videoId]
    );
    
    // Récupérer les social media
    const [socialMedia] = await pool.execute(
        `SELECT sm.id, sm.platform, sm.url
         FROM social_media sm
         INNER JOIN video_social_media vsm ON sm.id = vsm.social_media_id
         WHERE vsm.video_id = ?`,
        [videoId]
    );
    
    // Assembler la vidéo complète
    return {
        ...video,
        contributors,
        tags,
        stills,
        social_media: socialMedia
    };
}

export const videoModel = {
    createVideo,
    addContributors,
    addTags,
    addStills,
    addSocialMedia,
    createAdminStatus,
    getUserVideos,
    getVideoByIdWithDetails
};