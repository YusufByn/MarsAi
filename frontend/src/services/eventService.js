import { API_URL } from "../config.js"

export const eventService = {
    
    // Récupérer la liste des events
    async getAll(day){
        const url = new URL(`${API_URL}/api/events`);
        if (day) url.searchParams.append("day", day);

        const res = await fetch(url);
        const json = await res.json();

        if (!res.ok) throw new Error(json.message ||"Erreur lors de la récupération des events");

        return json.data;  // retourne le tableau des events
    },

    //  Récupérer 1 event par son id
    async getById(id){
        const res = await fetch(`${API_URL}/api/events/${id}`);
        const json = await res.json();

        if (!res.ok) throw new Error(json.message || "Erreur lors de la récupération de l'event");
        return json.data;  // retourne les détails de l'event
    },
    
};