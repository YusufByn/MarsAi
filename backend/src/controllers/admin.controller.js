import { videoModel } from '../models/video.model.js';

export const adminController = {
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
            
            if (!success) {
                return res.status(404).json({ message: "Film introuvable" });
            }

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
    }
};