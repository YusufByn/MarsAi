import { API_URL } from '../config';

export const videoService = {
  /**
   * Récupérer les vidéos (feed paginé)
   * @param {{ limit?, offset?, search?, classification? }} options
   */
  async getAll({ limit = 24, offset = 0, search = '', classification = '' } = {}) {
    const params = new URLSearchParams({ limit, offset });
    if (search) params.set('search', search);
    if (classification && classification !== 'all') params.set('classification', classification);

    const response = await fetch(`${API_URL}/api/videos?${params}`);
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
