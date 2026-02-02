import pool from '../config/db.js';

export const AdminVideo = {
    async listVideos({ page = 1, limit = 10, status, search }) {
        const offset = (page - 1) * limit;
        let query = `
            SELECT f.*, u.firstName, u.lastName 
            FROM films f 
            LEFT JOIN user u ON f.user_id = u.id 
            WHERE 1=1
        `;
        const params = [];

        if (status) {
            query += ' AND f.status = ?';
            params.push(status);
        }

        if (search) {
            query += ' AND (f.title LIKE ? OR u.firstName LIKE ? OR u.lastName LIKE ?)';
            const term = `%${search}%`;
            params.push(term, term, term);
        }

        query += ' ORDER BY f.created_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const [rows] = await pool.execute(query, params);
        
        const [countResult] = await pool.execute('SELECT COUNT(*) as total FROM films');
        
        return { films: rows, total: countResult[0].total };
    },

    async updateStatus(filmId, status) {
        const [result] = await pool.execute(
            'UPDATE films SET status = ? WHERE id = ?',
            [status, filmId]
        );
        return result.affectedRows > 0;
    },

    async assignVideo(filmId, userId) {

        const [result] = await pool.execute(
            'INSERT INTO votes (film_id, user_id, assigned_at) VALUES (?, ?, NOW()) ON DUPLICATE KEY UPDATE assigned_at = NOW()',
            [filmId, userId]
        );
        return result;
    }
};