const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

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
};
