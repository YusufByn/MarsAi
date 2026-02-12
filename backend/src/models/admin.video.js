import pool from '../config/db.js';

export const videoModel = {

    async findAll({ limit = 10, offset = 0, search = '', status = '' }) {
        // 1. Sécurisation des entiers pour l'injection directe (évite l'erreur 1210)
        const limitInt = parseInt(limit) || 10;
        const offsetInt = parseInt(offset) || 0;

        // 2. Construction de la condition WHERE dynamique
        let whereClause = 'WHERE 1=1';
        const params = [];

        if (status) {
            whereClause += ' AND v.status = ?';
            params.push(status);
        }

        if (search) {
            whereClause += ' AND (v.title LIKE ? OR v.realisator_name LIKE ? OR v.realisator_lastname LIKE ?)';
            const term = `%${search}%`;
            params.push(term, term, term);
        }

        // 3. Requête principale
        // NOTE: On injecte ${limitInt} et ${offsetInt} directement car '?' pose problème avec execute() sur LIMIT
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
                v.status, 
                v.created_at,
                v.country,
                v.duration,
                v.classification,
                v.tech_resume,
                v.youtube_url
            FROM video v
            LEFT JOIN user u ON v.user_id = u.id
            ${whereClause}
            ORDER BY v.created_at DESC 
            LIMIT ${limitInt} OFFSET ${offsetInt}
        `;

        // On exécute avec les params (qui ne contiennent plus limit/offset)
        const [rows] = await pool.execute(query, params);
        
        // 4. Requête pour le compteur total (doit respecter les mêmes filtres WHERE)
        const countQuery = `SELECT COUNT(*) as total FROM video v ${whereClause}`;
        const [countResult] = await pool.execute(countQuery, params);
        
        // 5. Formatage des données
        const formattedRows = rows.map(row => ({
            id: row.id,
            title: row.title,
            poster_url: row.poster_url,
            video_url: row.youtube_url,
            director: `${row.realisator_name || ''} ${row.realisator_lastname || ''}`.trim(),
            submitter: row.submitter_email || 'Inconnu',
            status: row.status,
            created_at: row.created_at,
            country: row.country,
            duration: row.duration,
            classification: row.classification,
            ai_tools: row.tech_resume ? row.tech_resume.split(',').map(t => t.trim()) : []
        }));

        return { videos: formattedRows, total: countResult[0].total };
    },

    async updateStatus(id, status) {
        const validStatuses = ['pending', 'approved', 'rejected'];
        if (!validStatuses.includes(status)) return false;

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