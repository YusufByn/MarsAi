import { API_URL } from '../config';

export const videoService = {
  /**
   * Récupérer toutes les vidéos (feed)
   */
  async getAll(limit = 100) {
    const response = await fetch(`${API_URL}/api/videos?limit=${limit}`);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des vidéos');
    }
    return response.json();
  },

  /**
   * Récupérer une vidéo par ID
   */
  async getById(id) {
    const response = await fetch(`${API_URL}/api/videos/${id}`);
    if (!response.ok) {
      throw new Error('Vidéo non trouvée');
    }
    return response.json();
  },

  /**
   * Récupérer tous les tags
   */
  async getAllTags() {
    const response = await fetch(`${API_URL}/api/tags`);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des tags');
    }
    return response.json();
  },
};
