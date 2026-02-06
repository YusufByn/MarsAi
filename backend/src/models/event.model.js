import pool from '../config/db.js';

export const eventModel = {
    async findAll() {
        // Récupère tout + calcule le nombre d'inscrits si tu as une table reservation
        // Sinon, utilise juste les champs de la table event
        const query = `
            SELECT e.*, 
            (SELECT COUNT(*) FROM reservation r WHERE r.event_id = e.id) as registered_count
            FROM event e ORDER BY e.date ASC
        `;
        const [rows] = await pool.execute(query);
        return rows;
    },
    // ... create, update, delete comme vu précédemment
};