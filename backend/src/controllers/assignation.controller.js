import { assignationModel } from '../models/assignation.model.js';

export const assignationController = {
    async getData(req, res) {
        try {
            const data = await assignationModel.getPanelData();
            const percentage = data.stats.total_videos > 0 
                ? Math.round((data.stats.assigned_videos / data.stats.total_videos) * 100) 
                : 0;

            res.json({
                ...data,
                stats: { ...data.stats, percentage }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur lors du chargement des données d'assignation" });
        }
    },

    async manualAssign(req, res) {
        try {
            const { juryIds, videoIds } = req.body;
            const count = await assignationModel.assignManual(juryIds, videoIds);
            
            res.json({ success: true, message: `${count} assignations créées avec succès.` });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur lors de l'assignation manuelle" });
        }
    },

    async randomAssign(req, res) {
        try {
            const { juryIds, limit, classification } = req.body;
            const count = await assignationModel.assignRandom(juryIds, limit, classification);
            
            res.json({ success: true, message: `${count} nouvelles assignations aléatoires créées pour le groupe.` });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur lors de l'assignation aléatoire" });
        }
    }
};