import pool from '../config/db.js';

export const assignationModel = {
    async getPanelData() {
        const [juries] = await pool.execute(`
            SELECT id, name, lastname, role
            FROM user
            WHERE role IN ('jury', 'selector')
            ORDER BY lastname ASC, name ASC
        `);
        
        const [videos] = await pool.execute(`
            SELECT 
                v.id,
                v.title,
                v.classification,
                v.country,
                v.duration,
                COALESCE(av.statut, 'pending') AS status
            FROM video v
            LEFT JOIN admin_video av ON av.video_id = v.id
            WHERE COALESCE(av.statut, 'pending') IN ('pending', 'validated')
        `);

        const [stats] = await pool.execute(`
            SELECT 
                (
                    SELECT COUNT(*)
                    FROM video v
                    LEFT JOIN admin_video av ON av.video_id = v.id
                    WHERE COALESCE(av.statut, 'pending') IN ('pending', 'validated')
                ) as total_videos,
                (SELECT COUNT(DISTINCT video_id) FROM assignation) as assigned_videos
        `);

        return { 
            juries, 
            videos, 
            stats: stats[0] 
        };
    },

    async assignManual(juryIds, videoIds) {
        if (!juryIds.length || !videoIds.length) return false;

        let values = [];
        juryIds.forEach(juryId => {
            videoIds.forEach(videoId => {
                values.push(`(${juryId}, ${videoId})`);
            });
        });

        const query = `INSERT IGNORE INTO assignation (user_id, video_id) VALUES ${values.join(',')}`;
        const [result] = await pool.execute(query);
        return result.affectedRows;
    },

    async assignRandom(juryIds, limit, classification) {
        let filterQuery = "WHERE COALESCE(av.statut, 'pending') IN ('pending', 'validated')";
        let params = [];

        if (classification && classification !== 'all') {
            filterQuery += " AND v.classification = ?";
            params.push(classification);
        }

        const queryVideos = `
            SELECT v.id
            FROM video v
            LEFT JOIN admin_video av ON av.video_id = v.id
            ${filterQuery}
            ORDER BY RAND() 
            LIMIT ?
        `;

        params.push(parseInt(limit));

        const [randomVideos] = await pool.execute(queryVideos, params);
        
        if (randomVideos.length === 0) return 0;

        const videoIds = randomVideos.map(v => v.id);

        return await this.assignManual(juryIds, videoIds);
    }
};