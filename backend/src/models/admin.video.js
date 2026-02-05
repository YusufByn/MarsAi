import pool from '../config/db.js';

export const videoModel = {

    async findAll({ limit = 10, offset = 0, search = '', status = '' }) {
        let query = `
            SELECT 
                id, 
                title, 
                cover as poster_url, 
                realisator_name, 
                realisator_lastname,
                status, 
                created_at,
                country,
                duration,
                tech_resume    
            FROM video 
            WHERE 1=1
        `;
        
        const params = [];

        if (status) {
            query += ' AND status = ?';
            params.push(status);
        }

        if (search) {
            query += ' AND (title LIKE ? OR realisator_name LIKE ? OR realisator_lastname LIKE ?)';
            const term = `%${search}%`;
            params.push(term, term, term);
        }

        query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const [rows] = await pool.execute(query, params);
        
        const formattedRows = rows.map(row => ({
            id: row.id,
            title: row.title,
            poster_url: row.poster_url,
            director_name: `${row.realisator_name || ''} ${row.realisator_lastname || ''}`.trim(),
            status: row.status,
            created_at: row.created_at,
            country: row.country,
            duration: row.duration,
            ai_tools: row.tech_resume ? row.tech_resume.split(',').map(t => t.trim()) : []
        }));
        const [countResult] = await pool.execute('SELECT COUNT(*) as total FROM video');
        
        return { videos: formattedRows, total: countResult[0].total };
    },

    async updateStatus(id, status) {
        const [result] = await pool.execute(
            'UPDATE video SET status = ? WHERE id = ?', 
            [status, id]
        );
        return result.affectedRows > 0;
    },

    async delete(id) {
        const [result] = await pool.execute('DELETE FROM video WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
};