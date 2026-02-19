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

            const validStatuses = ['pending', 'approved', 'rejected'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ message: "Statut invalide" });
            }

            const success = await videoModel.updateStatus(id, status);
            if (!success) return res.status(404).json({ message: "Film introuvable" });

            res.json({ message: `Statut mis a jour : ${status}` });
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
            const configData = req.body; 

            res.json({ success: true, message: "Section mise à jour" });
        } catch (error) {
            console.error("Update CMS Error:", error);
            res.status(500).json({ message: "Erreur mise à jour CMS" });
        }
    },

    async listUsers(req, res) {
        try {
            const users = await adminUserModel.findAll(req.user.role);
            res.json(users);
        } catch (error) {
            console.error('[ADMIN] Erreur listUsers:', error);
            res.status(500).json({ message: "Erreur lors de la recuperation des utilisateurs" });
        }
    },

    async createUser(req, res) {
        try {
            const { email, password, role, name, lastname } = req.body;
            if (!email || !password || !role || !name || !lastname) {
                return res.status(400).json({ message: "Tous les champs sont requis" });
            }
            const newUser = await adminUserModel.create({ email, password, role, name, lastname }, req.user.role);
            res.json({ success: true, user: newUser });
        } catch (error) {
            console.error('[ADMIN] Erreur createUser:', error);
            if (error.message === 'Role non autorise') {
                return res.status(403).json({ message: error.message });
            }
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ message: "Cet email est deja utilise" });
            }
            res.status(500).json({ message: "Erreur lors de la creation de l'utilisateur" });
        }
    },

    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const { email, role, name, lastname } = req.body;
            await adminUserModel.update(id, { email, role, name, lastname }, req.user.role);
            res.json({ success: true });
        } catch (error) {
            console.error('[ADMIN] Erreur updateUser:', error);
            if (error.message === 'Permission refusee' || error.message === 'Role non autorise') {
                return res.status(403).json({ message: error.message });
            }
            if (error.message === 'Utilisateur introuvable') {
                return res.status(404).json({ message: error.message });
            }
            res.status(500).json({ message: "Erreur lors de la mise a jour" });
        }
    },

    async deleteUser(req, res) {
        try {
            await adminUserModel.delete(req.params.id, req.user.role);
            res.json({ success: true });
        } catch (error) {
            console.error('[ADMIN] Erreur deleteUser:', error);
            if (error.message === 'Permission refusee') {
                return res.status(403).json({ message: error.message });
            }
            if (error.message === 'Utilisateur introuvable') {
                return res.status(404).json({ message: error.message });
            }
            res.status(500).json({ message: "Erreur lors de la suppression" });
        }
    }
};