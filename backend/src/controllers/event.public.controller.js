import { pool } from "../db/index.js";

export const eventsPublicController = {

    // GET /api/events?day=2026-04-01
    async listEvents(req, res) {
        try {
            
            const { day } = req.query; // ex: "2026-04-01"

            // Validation simple du format YYYY-MM-DD
            if (day && !/^\d{4}-\d{2}-\d{2}$/.test(day)){
                return res.status(400).json({
                    success: false,
                    message: "Paramètre 'day' invalide. Format attendu: YYYY-MM-DD",
                });
            }

            // Base SQL + params (requête préparée => pool.execute protège via les ?)
            const baseSql = `
                SELECT id, title, description, date, duration, stock, illustration, location
                FROM event
            `;

            const whereSql = day ? `WHERE DATE(date) = ?` : ``;
            const orderSql = `ORDER BY date ASC`;

            const sql = baseSql + whereSql + orderSql;
            const params = day ? [day] : [];

            const [rows] = await pool.execute(sql, params);

            return res.json({
                success: true,
                data: rows,
            });

        } catch (error) {
            console.error("[EVENTS] listEvents error:", error);
            return res.status(500).json({
                success: false,
                message: "Erreur serveur",
            });
        }
    },

    // GET /api/events/:id  (detail d'un event)
    async getEventById(req, res){
        try {
            const { id } = req.params;

            // id doit être un entier positif
            const eventId = Number(id);

            if (!Number.isInteger(eventId) || eventId <= 0){
                return res.status(400).json({
                    success: false,
                    message: "Paramètre 'id' invalide",
                });
            }

            const [rows] = await pool.execute(
                `SELECT id, title, description, date, duration, stock, illustration, location
                    FROM event
                    WHERE id = ?`,
                [eventId]
            );

            if (rows.length === 0){
                
                return res.status(404).json({
                    success: false,
                    message: "Event introuvable"
                });
            }

            return res.json({
                success: true,
                data: rows[0]
            });

        } catch (error){

            console.error("[EVENTS] getEventById error:", error);

            return res.status(500).json({
                success: false,
                message: "Erreur serveur"
            });

        }
    },
};