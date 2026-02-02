import { AdminVideo } from '../models/admin.video.js';

export const adminController = {

    async listVideos(req, res) {
        try {
            const { page, status, search } = req.query;
            const data = await AdminVideo.listVideos({ page, status, search });
            res.json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur serveur lors de la récupération des films" });
        }
    },


    async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body; 
            
            const success = await AdminVideo.updateStatus(id, status);
            if (!success) return res.status(404).json({ message: "Film introuvable" });

            res.json({ message: "Statut mis à jour avec succès", status });
        } catch (error) {
            res.status(500).json({ message: "Erreur mise à jour statut" });
        }
    }
};