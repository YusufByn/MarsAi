import pool from '../config/db.js';

export const videoModel = {

    async findAll({ limit = 10, offset = 0, search = '', status = '' }) {
        const limitInt = parseInt(limit) || 10;
        const offsetInt = parseInt(offset) || 0;

        let whereClause = 'WHERE 1=1';
        const params = [];

        if (status) {
            whereClause += ' AND COALESCE(av.statut, \'pending\') = ?';
            params.push(status);
        }

        if (search) {
            whereClause += ' AND (v.title LIKE ? OR v.realisator_name LIKE ? OR v.realisator_lastname LIKE ?)';
            const term = `%${search}%`;
            params.push(term, term, term);
        }

        const query = `
            SELECT
                v.id,
                v.user_id,
                u.email as submitter_email,
                u.name as submitter_name,
                v.title,
                v.cover as poster_url,
                v.realisator_name,
                v.realisator_lastname,
                COALESCE(av.statut, 'pending') as statut,
                v.created_at,
                v.country,
                v.duration,
                v.classification,
                v.tech_resume,
                v.youtube_url
            FROM video v
            LEFT JOIN user u ON v.user_id = u.id
            LEFT JOIN admin_video av ON av.video_id = v.id
            ${whereClause}
            ORDER BY v.created_at DESC
            LIMIT ${limitInt} OFFSET ${offsetInt}
        `;

        const [rows] = await pool.execute(query, params);

        const countQuery = `
            SELECT COUNT(*) as total
            FROM video v
            LEFT JOIN admin_video av ON av.video_id = v.id
            ${whereClause}
        `;
        const [countResult] = await pool.execute(countQuery, params);

        const formattedRows = rows.map(row => ({
            id: row.id,
            title: row.title,
            poster_url: row.poster_url,
            video_url: row.youtube_url,
            director: `${row.realisator_name || ''} ${row.realisator_lastname || ''}`.trim(),
            submitter: row.submitter_email || 'Inconnu',
            status: row.statut,
            created_at: row.created_at,
            country: row.country,
            duration: row.duration,
            classification: row.classification,
            ai_tools: row.tech_resume ? row.tech_resume.split(',').map(t => t.trim()) : []
        }));

        return { videos: formattedRows, total: countResult[0].total };
    },

    async getDashboardStats() {
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            const [videoCounts] = await connection.query(
                `SELECT COALESCE(av.statut, 'pending') as statut, COUNT(*) as count
                 FROM video v
                 LEFT JOIN admin_video av ON av.video_id = v.id
                 GROUP BY statut`
            );

            const [recentVideos] = await connection.query(
                `SELECT v.id, v.title, v.cover as poster_url, v.realisator_name, v.realisator_lastname,
                        COALESCE(av.statut, 'pending') as statut, v.created_at, v.country, v.duration, v.classification
                 FROM video v
                 LEFT JOIN admin_video av ON av.video_id = v.id
                 ORDER BY v.created_at DESC LIMIT 5`
            );

            const [eventCount] = await connection.query(
                'SELECT COUNT(*) as total FROM event'
            );

            const [juryCount] = await connection.query(
                'SELECT COUNT(*) as total FROM jury'
            );

            const [newsletterCount] = await connection.query(
                'SELECT COUNT(*) as total FROM newsletter WHERE unsubscribed_at IS NULL'
            );

            const [userCount] = await connection.query(
                'SELECT COUNT(*) as total FROM user'
            );

            const [usersByRole] = await connection.query(
                `SELECT role, COUNT(*) as count FROM user GROUP BY role`
            );

            const [selectorMemoCount] = await connection.query(
                'SELECT COUNT(*) as total FROM selector_memo'
            );

            await connection.commit();

            const counts = { total: 0, pending: 0, validated: 0, rejected: 0 };
            for (const row of videoCounts) {
                const c = Number(row.count);
                counts.total += c;
                if (row.statut === 'pending') counts.pending += c;
                else if (row.statut === 'validated') counts.validated += c;
                else if (row.statut === 'rejected') counts.rejected += c;
            }

            const formattedVideos = recentVideos.map(row => ({
                id: row.id,
                title: row.title,
                poster_url: row.poster_url,
                director: `${row.realisator_name || ''} ${row.realisator_lastname || ''}`.trim(),
                status: row.statut,
                created_at: row.created_at,
                country: row.country,
                duration: Number(row.duration) || 0,
                classification: row.classification,
            }));

            const roles = {};
            for (const row of usersByRole) {
                roles[row.role] = Number(row.count);
            }

            return {
                total_videos: counts.total,
                pending_videos: counts.pending,
                validated_videos: counts.validated,
                rejected_videos: counts.rejected,
                recent_videos: formattedVideos,
                total_events: Number(eventCount[0].total) || 0,
                total_jury: Number(juryCount[0].total) || 0,
                total_newsletter: Number(newsletterCount[0].total) || 0,
                total_users: Number(userCount[0].total) || 0,
                users_by_role: roles,
                total_evaluations: Number(selectorMemoCount[0].total) || 0,
            };

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    async updateStatus(videoId, statut, adminUserId) {
        const validStatuses = ['draft', 'pending', 'validated', 'rejected', 'banned'];
        if (!validStatuses.includes(statut)) return false;

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            await connection.execute(
                `INSERT INTO admin_video (video_id, user_id, statut)
                 VALUES (?, ?, ?)
                 ON DUPLICATE KEY UPDATE statut = ?, user_id = ?, updated_at = NOW()`,
                [videoId, adminUserId, statut, statut, adminUserId]
            );

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    async delete(id) {
        const [result] = await pool.execute('DELETE FROM video WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
};
