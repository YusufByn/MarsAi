// src/controllers/events.controller.js
import { pool } from '../db/index.js';

// Helpers: valeurs autorisées (car enums en DB)
const ALLOWED_TYPES = new Set(['conference', 'workshop', 'screening']);
const ALLOWED_STATUS = new Set(['draft', 'published', 'cancelled', 'archived']);

export const eventsController = {
    // Liste des events (admin)
    async listEvents(req, res) {
        try {
            const [rows] = await pool.execute(
                `SELECT id, title, description, type, status, date, end_at, duration, stock,
                    illustration, location, is_active, created_by, created_at, updated_at
                FROM event
                ORDER BY date ASC`
            );

            return res.json({ success: true, data: rows });
        } catch (err) {
            console.error('[EVENTS] listEvents error:', err);
            return res.status(500).json({
                success: false,
                message: 'Erreur serveur'
            });
        }
    },

    // Création d'un event (admin)
    async createEvent(req, res)     {
        try {
            const {
                title,
                description = null,
                type = 'conference',
                status = 'draft',
                date,
                end_at = null,
                duration = null,
                stock = null,
                illustration = null,
                location = null,
                is_active = 1,
            } = req.body;

            // Champs obligatoires
            if (!title || !date){
                return res.status(400).json({
                    success: false,
                    message: 'title et date sont requis'
                });
            }

            // Validation simple (tu mettras zod après)
            if (!ALLOWED_TYPES.has(type)){
                return res.status(400).json({
                    success: false,
                    message: 'type invalide'
                });
            }
            if (!ALLOWED_STATUS.has(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'status invalide'
                });
            }

            // created_by vient du token (middleware checkAuth)
            const createdBy = req.user?.id;
            if (!createdBy) {
                return res.status(401).json({
                    success: false,
                    message: 'Non authentifié'
                });
            }

            const [result] = await pool.execute(
                `INSERT INTO event
                    (title, description, type, status, date, end_at, duration, stock, illustration, location, is_active, created_by)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [title, description, type, status, date, end_at, duration, stock, illustration, location, is_active ? 1 : 0, createdBy]
            );

            return res.status(201).json({
                success: true,
                message: 'Event créé',
                data: { id: result.insertId },
            });

        } catch (err){

            console.error('[EVENTS] createEvent error:', err);
            return res.status(500).json({
                success: false,
                message: 'Erreur serveur'
            });
        }
    },

    // UPDATE  /events/:id/update
    async updateEvent(req, res){
        try {
            const { id } = req.params;

            // On autorise une mise à jour partielle : tu envoies seulement ce que tu changes
            const payload = { ...req.body };

            // Si end_at est "" dans un form, on le transforme en NULL
            if (payload.end_at === '') payload.end_at = null;

            // Sécurité: on filtre les champs modifiables
            const allowedFields = [
            'title',
            'description',
            'type',
            'status',
            'date',
            'end_at',
            'duration',
            'stock',
            'illustration',
            'location',
            'is_active',
            ];

            const fields = [];
            const values = [];

            for (const key of allowedFields){
                if (payload[key] === undefined) continue;

                // Validations rapides sur enums
                if (key === 'type' && !ALLOWED_TYPES.has(payload.type)){

                    return res.status(400).json({
                        success: false,
                        message: 'type invalide'
                    });
                }

                if (key === 'status' && !ALLOWED_STATUS.has(payload.status)){
                    return res.status(400).json({
                        success: false,
                        message: 'status invalide'
                    });
                }

                if (key === 'is_active'){
                    fields.push(`${key} = ?`);
                    values.push(payload[key] ? 1 : 0);

                } else {

                    fields.push(`${key} = ?`);
                    values.push(payload[key]);
                
                }
            }

            if (fields.length === 0){
                return res.status(400).json({
                    success: false,
                    message: 'Aucun champ à mettre à jour'
                });
            }

            values.push(id);

            const [result] = await pool.execute(
                `UPDATE event SET ${fields.join(', ')} WHERE id = ?`,
                values
            );

            if (result.affectedRows === 0){
                return res.status(404).json({
                    success: false,
                    message: 'Event introuvable'
                });
            }

            return res.json({
                success: true,
                message: 'Event mis à jour'
            });

        } catch (err){

            console.error('[EVENTS] updateEvent error:', err);
            return res.status(500).json({
                success: false,
                message: 'Erreur serveur'
            });
        }
    },

    // Suppression d'un event (admin)
    async deleteEvent(req, res){
        try {
            const { id } = req.params;

            const [result] = await pool.execute(`DELETE FROM event WHERE id = ?`, [id]);

            if (result.affectedRows === 0){
                return res.status(404).json({
                    success: false,
                    message: 'Event introuvable'
                });
            }

            return res.json({
                success: true,
                message: 'Event supprimé'
            });

        } catch (err){

            console.error('[EVENTS] deleteEvent error:', err);
            return res.status(500).json({
                success: false,
                message: 'Erreur serveur'
            });
        }
    },
};
