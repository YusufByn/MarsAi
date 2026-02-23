import { API_URL } from "../config.js"

export const eventService = {
    
    // Récupérer tous les events
    async getAll() {
        const res = await fetch(`${API_URL}/api/events`);
        if (!res.ok) throw new Error("Erreur lors de la récupération des events");
        return res.json();
    },

    // Récupérer 1 event par id
    async getById(id) {
        const res = await fetch(`${API_URL}/api/events/${id}`);
        if (!res.ok) throw new Error("Event non trouvé");
        return res.json();
    },
};