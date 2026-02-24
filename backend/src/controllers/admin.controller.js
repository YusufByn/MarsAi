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

    // GET Tout les Events
    async listEvents(req, res) {
        try {
            const events = await EventModel.findAll();
            res.json({
                success: true,
                data: events,
            });
        } catch (error) {
            console.error('[ADMIN] Erreur listEvents:', error);
            res.status(500).json({
                success: false,
                message: "Erreur events"
            });
        }
    },
    
    // Admin et SuperAdmin => GET (detail d'un event) 
    async getEventById(req, res){
        try {

            const eventId = Number(req.params.id);
            
            if (!Number.isInteger(eventId) || eventId <= 0){
                return res.status(400).json({
                    success: false,
                    message: "ID invalide",
                });
            }
            const event = await EventModel.findById(eventId);

            if (!event){
                return res.status(404).json({
                    success: false,
                    message: "Event introuvable",
                });
            }

            return res.json({
                success: true,
                data: event,
            });

        }catch (error){

            console.error('[ADMIN] Erreur getEventById:', error);
            
            return res.status(500).json({
                success: false,
                message: "Erreur serveur",
            });
        }
    },

    async createEvent(req, res) {
        try {
            const { title, description, date, duration, stock, illustration, location } = req.body;

            if (!req.user?.id) {
                return res.status(401).json({
                    success: false,
                    message: "Non authentifié"
                });
            }

            console.log("CREATE EVENT BODY =", req.body);
            console.log("CONTENT-TYPE =", req.headers["content-type"]);
            if (!title || !date) {
                return res.status(400).json({
                    success: false,
                    message: "title et date sont obligatoires",
                });
            }

            const payload = {
                title: title.trim(),
                description: description?.trim() || null,
                date,
                duration: duration ?? null,
                stock: stock ?? null,
                illustration: illustration?.trim() || null,
                location: location?.trim() || null,
                created_by: req.user.id,
            };

            const newId = await EventModel.create(payload);

            return res.status(201).json({
                success: true,
                id: newId
            });
        } catch (error) {
            console.error("[ADMIN] Erreur createEvent:", error);
            return res.status(500).json({
            success: false,
            message: error?.sqlMessage || error?.message || "Erreur création event",
            });
        }
    },

    // Admin et SuperAdmin => PUT (modification d'un event)
    async updateEvent(req, res){
        try {
            
            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0){
                return res.status(400).json({
                    success: false,
                    message: "ID invalide",
                });
            }

            const {
                title,
                date,
                location
            } = req.body;

            if (!title || !date || !location){
                return res.status(400).json({
                    success: false,
                    message: "Champs requis manquants",
                });
            }

            const updated = await EventModel.update(id, req.body);

            if (!updated){
                return res.status(404).json({
                    success: false,
                    message: "Event introuvable",
                });
            }

            return res.json({
                success: true,
                message: "Event mis à jour",
            });

        } catch (error){

            console.error('[ADMIN] Erreur updateEvent:', error);

            return res.status(500).json({
                success: false,
                message: "Erreur serveur",
            });
        }
    },


    async deleteEvent(req, res) {
        try {
            const success = await EventModel.delete(req.params.id);

            if (!success) return res.status(404).json({
                success: false,
                message: "Événement introuvable"
            });

            res.json({ success: true });

        } catch (error) {
            console.error('[ADMIN] Erreur deleteEvent:', error);

            res.status(500).json({
                success: false,
                message: "Erreur suppression event"
            });
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
