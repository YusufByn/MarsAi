import pool from '../config/db.js';

export const assignationModel = {
    async getPanelData() {
        const [juries] = await pool.execute('SELECT id, name, lastname FROM jury');
        
        const [videos] = await pool.execute(`
            SELECT id, title, classification, country, duration, status 
            FROM video 
            WHERE status IN ('pending', 'approved')
        `);

        const [stats] = await pool.execute(`
            SELECT 
                (SELECT COUNT(*) FROM video WHERE status IN ('pending', 'approved')) as total_videos,
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
        let filterQueryy = "WHERE status IN ('pending', 'approved')";
        let params = [];

        if (classification && classification !== 'all') {
            filterQueryy += " AND classification = ?";
            params.push(classification);
        }

        const queryVideos = `
            SELECT id FROM video 
            ${filterQueryy} 
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