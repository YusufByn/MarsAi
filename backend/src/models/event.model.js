import pool from '../config/db.js';

export const EventModel = {
    async findAll() {
        const query = `
            SELECT 
                id, 
                title, 
                description, 
                date, 
                duration, 
                stock, 
                illustration, 
                location,
                created_by,
                created_at 
            FROM event 
            ORDER BY date ASC
        `;
        const [rows] = await pool.execute(query);
        return rows;
    },

    async create(data) {
        const { title, description, date, duration, stock, illustration, location, created_by } = data;
        
        const query = `
            INSERT INTO event 
            (title, description, date, duration, stock, illustration, location, created_by, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `;
        
        const [result] = await pool.execute(query, [
            title, description, date, duration, stock, illustration, location, created_by
        ]);
        return result.insertId;
    },

    async delete(id) {
        const [result] = await pool.execute('DELETE FROM event WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
};