import { videoModel } from '../models/admin.video.js';
import { EventModel } from '../models/event.model.js';
import { CmsModel } from '../models/cms.model.js';
import { adminUserModel } from '../models/admin.user.model.js';
import { createInvite } from '../models/invite.model.js';
import { sendInvitationEmail } from '../services/email.service.js';
import { logActivity } from '../utils/activity.util.js';

export const adminController = {

    // --- DASHBOARD ---

    async getDashboardStats(req, res) {
        try {
            const stats = await videoModel.getDashboardStats();
            res.json(stats);
        } catch (error) {
            console.error('[ADMIN] Erreur getDashboardStats:', error);
            res.status(500).json({ message: "Erreur stats" });
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
            console.error('[ADMIN] Erreur listVideos:', error);
            res.status(500).json({ message: "Erreur lors de la récupération des films" });
        }
    },

    async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const validStatuses = ['draft', 'pending', 'validated', 'rejected', 'banned'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ message: "Statut invalide" });
            }

            const success = await videoModel.updateStatus(id, status, req.user.id);
            if (!success) return res.status(404).json({ message: "Film introuvable" });

            logActivity({ action: 'admin_video_status', userId: req.user.id, entity: 'video', entityId: Number(id), details: status, ip: req.ip });

            res.json({ message: `Statut mis a jour : ${status}` });
        } catch (error) {
            console.error('[ADMIN] Erreur updateStatus:', error);
            res.status(500).json({ message: "Erreur serveur" });
        }
    },

    async deleteVideo(req, res) {
        try {
            const success = await videoModel.delete(req.params.id);
            if (!success) return res.status(404).json({ message: "Film introuvable" });

            res.json({ message: "Film supprimé définitivement" });
        } catch (error) {
            console.error('[ADMIN] Erreur deleteVideo:', error);
            res.status(500).json({ message: "Erreur suppression" });
        }
    },

    // --- EVENTS ---

    async listEvents(req, res) {
        try {
            const events = await EventModel.findAll();
            res.json(events);
        } catch (error) {
            console.error('[ADMIN] Erreur listEvents:', error);
            res.status(500).json({ message: "Erreur events" });
        }
    },

    async createEvent(req, res) {
        try {
            const newId = await EventModel.create({ ...req.body, created_by: req.user.id });
            res.json({ success: true, id: newId });
        } catch (error) {
            console.error('[ADMIN] Erreur createEvent:', error);
            res.status(500).json({ message: "Erreur création event" });
        }
    },

    async deleteEvent(req, res) {
        try {
            const success = await EventModel.delete(req.params.id);
            if (!success) return res.status(404).json({ message: "Événement introuvable" });
            res.json({ success: true });
        } catch (error) {
            console.error('[ADMIN] Erreur deleteEvent:', error);
            res.status(500).json({ message: "Erreur suppression event" });
        }
    },

    // --- CMS ---

    async getCms(req, res) {
        try {
            const data = await CmsModel.findAll();
            res.json(data);
        } catch (error) {
            console.error('[ADMIN] Erreur getCms:', error);
            res.status(500).json({ message: "Erreur CMS" });
        }
    },

    async updateCms(req, res) {
        try {
            const { section_type } = req.params;
            const configData = req.body;

            await CmsModel.update(section_type, configData);
            res.json({ success: true });
        } catch (error) {
            console.error('[ADMIN] Erreur updateCms:', error);
            res.status(500).json({ message: "Erreur mise à jour CMS" });
        }
    },

    // --- USERS ---

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
            logActivity({ action: 'admin_user_create', userId: req.user.id, entity: 'user', entityId: newUser.id, details: `${email} (${role})`, ip: req.ip });
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
            logActivity({ action: 'admin_user_delete', userId: req.user.id, entity: 'user', entityId: Number(req.params.id), ip: req.ip });
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
    },

    // --- INVITE ---

    async sendInvite(req, res) {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ message: "Email requis" });
            }
            const token = createInvite(email);
            await sendInvitationEmail(email, token);
            logActivity({ action: 'admin_invite_sent', userId: req.user.id, details: email, ip: req.ip });
            console.log('[ADMIN] Invitation envoyée à:', email);
            res.json({ success: true });
        } catch (error) {
            console.error('[ADMIN] Erreur sendInvite:', error);
            res.status(500).json({ message: "Erreur lors de l'envoi de l'invitation" });
        }
    }
};
