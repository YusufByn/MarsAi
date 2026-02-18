import { videoModel } from '../models/admin.video.js';
import { EventModel } from '../models/event.model.js';
import { CmsModel } from '../models/cms.model.js'; 
import { juryModel } from '../models/jury.model.js'; // Ajouté si tu veux gérer les jurys ici

export const adminController = {

    // --- DASHBOARD ---
    async getDashboardStats(req, res) {
        try {
            // On récupère juste le count total via la méthode existante
            const videoStats = await videoModel.findAll({ limit: 1 }); 
            const eventList = await EventModel.findAll();
            
            res.json({
                total_videos: videoStats.total,
                total_events: eventList.length,
            });
        } catch (error) {
            console.error("Dashboard Stats Error:", error);
            res.status(500).json({ message: "Erreur lors de la récupération des statistiques" });
        }
    },

    // --- VIDEOS ---
    async listVideos(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;
            const { search, status } = req.query;

            const data = await videoModel.findAll({ limit, offset, search, status });
            res.json(data);
        } catch (error) {
            console.error("List Videos Error:", error);
            res.status(500).json({ message: "Erreur lors de la récupération des films" });
        }
    },

    async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const success = await videoModel.updateStatus(id, status);
            if (!success) return res.status(404).json({ message: "Film introuvable ou statut invalide" });

            res.json({ message: `Statut mis à jour : ${status}` });
        } catch (error) {
            console.error("Update Status Error:", error);
            res.status(500).json({ message: "Erreur serveur" });
        }
    },

    async deleteVideo(req, res) {
        try {
            const success = await videoModel.delete(req.params.id);
            if (!success) return res.status(404).json({ message: "Film introuvable" });
            
            res.json({ message: "Film supprimé définitivement" });
        } catch (error) {
            console.error("Delete Video Error:", error);
            res.status(500).json({ message: "Erreur suppression" });
        }
    },

    // --- EVENTS ---
    async listEvents(req, res) {
        try {
            const events = await EventModel.findAll();
            res.json(events);
        } catch (error) {
            console.error("List Events Error:", error);
            res.status(500).json({ message: "Erreur events" });
        }
    },

    async createEvent(req, res) {
        try {
            if (!req.user || !req.user.id) {
                return res.status(401).json({ message: "Utilisateur non authentifié" });
            }
            const newId = await EventModel.create({ ...req.body, created_by: req.user.id });
            res.json({ success: true, id: newId, message: "Événement créé" });
        } catch (error) {
            console.error("Create Event Error:", error);
            res.status(500).json({ message: "Erreur création event" });
        }
    },

    async deleteEvent(req, res) {
        try {
            const success = await EventModel.delete(req.params.id);
            if(!success) return res.status(404).json({ message: "Événement introuvable" });
            res.json({ success: true, message: "Événement supprimé" });
        } catch (error) {
            console.error("Delete Event Error:", error);
            res.status(500).json({ message: "Erreur suppression event" });
        }
    },

    // --- CMS ---
    async getCms(req, res) {
        try {
            const data = await CmsModel.findAll();
            res.json(data);
        } catch (error) {
            console.error("Get CMS Error:", error);
            res.status(500).json({ message: "Erreur CMS" });
        }
    },

    async updateCms(req, res) {
        try {
            const { section_type } = req.params;
            const payload = req.body; // Contient title, config, image_file, etc.

            const success = await CmsModel.update(section_type, payload);
            if (!success) return res.status(404).json({ message: "Section introuvable" });

            res.json({ success: true, message: "Section mise à jour" });
        } catch (error) {
            console.error("Update CMS Error:", error);
            res.status(500).json({ message: "Erreur mise à jour CMS" });
        }
    }
};