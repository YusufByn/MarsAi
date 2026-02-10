import { videoModel } from '../models/admin.video.js';
import { EventModel } from '../models/event.model.js';
import { CmsModel } from '../models/cms.model.js'; 

export const adminController = {

    async getDashboardStats(req, res) {
        try {

            const videoStats = await videoModel.findAll({ limit: 1 }); 
            const eventList = await EventModel.findAll();
            
            res.json({
                total_videos: videoStats.total,
                total_events: eventList.length,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur stats" });
        }
    },

    async listVideos(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;
            const { search, status } = req.query;

            const data = await videoModel.findAll({ limit, offset, search, status });
            res.json(data);
        } catch (error) {
            console.error("Erreur listVideos:", error);
            res.status(500).json({ message: "Erreur lors de la récupération des films" });
        }
    },

    async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const validStatuses = ['pending', 'approved', 'rejected'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ message: "Statut invalide" });
            }

            const success = await videoModel.updateStatus(id, status);
            if (!success) return res.status(404).json({ message: "Film introuvable" });

            res.json({ message: `Statut mis à jour : ${status}` });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur serveur" });
        }
    },

    async deleteVideo(req, res) {
        try {
            const success = await videoModel.delete(req.params.id);
            if (!success) return res.status(404).json({ message: "Film introuvable" });
            
            res.json({ message: "Film supprimé définitivement" });
        } catch (error) {
            res.status(500).json({ message: "Erreur suppression" });
        }
    },

    // --- ÉVÈNEMENTS ---
    async listEvents(req, res) {
        try {
            const events = await EventModel.findAll();
            res.json(events);
        } catch (error) {
            res.status(500).json({ message: "Erreur events" });
        }
    },

    async createEvent(req, res) {
        try {
            // req.user.id vient du middleware checkAuth
            const newId = await EventModel.create({ ...req.body, created_by: req.user.id });
            res.json({ success: true, id: newId });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur création event" });
        }
    },

    async deleteEvent(req, res) {
        try {
            await EventModel.delete(req.params.id);
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ message: "Erreur suppression event" });
        }
    },

    // --- CMS ---
    async getCms(req, res) {
        try {
            const data = await CmsModel.findAll();
            res.json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur CMS" });
        }
    },

    async updateCms(req, res) {
        try {
            const { section_type } = req.params; // ex: 'hero'
            const configData = req.body; // L'objet complet envoyé par le front

            await CmsModel.update(section_type, configData);
            res.json({ success: true });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur mise à jour CMS" });
        }
    }
};