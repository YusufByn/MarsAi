import { pool } from "../db/index.js";

export const eventsPublicController = {

    // GET /api/events?day=2026-04-01
    async listEvents(req, res) {
        try {
            const { day } = req.query;  // ex: "2026-04-01"

            // Validation simple du format YYYY-MM-DD
            if (day && !/^\d{4}-\d{2}-\d{2}$/.test(day)){
                return res.status(400).json({
                    success: false,
                    message: "Paramètre 'day' invalide. Format attendu: YYYY-MM-DD",
                });
            }

            // Base SQL 
            const baseSql = `
                SELECT id, title, description, date, duration, stock, illustration, location
                FROM event
            `;
            
            // Si day est fourni, on ajoute une clause WHERE pour filtrer les events de ce jour
            const whereSql = day ? `WHERE DATE(date) = ?` : ``;

            // On trie les events par date croissante
            const orderSql = `ORDER BY date ASC`;

            // Construction de la requête finale et exécution
            const sql = `${baseSql} ${whereSql} ${orderSql}`;
            // Si day est fourni, on passe sa valeur dans les paramètres de la requête, sinon on passe un tableau vide
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
            const eventId = Number(req.params.id);

            // Validation de l'id (doit être un entier positif)
            if (!Number.isInteger(eventId) || eventId <= 0){
                return res.status(400).json({
                    success: false,
                    message: "Paramètre 'id' invalide",
                });
            }

            // Requête SQL pour récupérer les détails de l'event par son id
            const [rows] = await pool.execute(
                `SELECT id, title, description, date, duration, stock, illustration, location
                    FROM event
                    WHERE id = ?`,
                [eventId]
            );

            // Si aucun event n'est trouvé avec cet id, on retourne une erreur 404
            if (rows.length === 0){
                
                return res.status(404).json({
                    success: false,
                    message: "Event introuvable"
                });
            }

            // Si l'event est trouvé, on retourne ses détails
            return res.json({
                success: true,
                data: rows[0]
            });

        } catch (error){
            // En cas d'erreur, on log l'erreur et on retourne une réponse d'erreur
            console.error("[EVENTS] getEventById error:", error);

            return res.status(500).json({
                success: false,
                message: "Erreur serveur"
            });

        }
    },
};