import { API_URL } from '../config';

export const selectorMemoService = {
  /**
   * Récupérer tous les memos d'un utilisateur
   */
  async getAllByUser(userId) {
    const response = await fetch(`${API_URL}/api/memo/user/${userId}`);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des memos');
    }
    return response.json();
  },

  /**
   * Récupérer un memo spécifique (user + video)
   */
  async getOne(videoId, userId) {
    const response = await fetch(`${API_URL}/api/memo/${videoId}/${userId}`);
    if (!response.ok) {
      throw new Error('Memo not found');
    }
    return response.json();
  },

  /**
   * Créer ou mettre à jour un memo
   */
  async upsert(memoData) {
    const response = await fetch(`${API_URL}/api/memo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(memoData),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la sauvegarde du memo');
    }
    return response.json();
  },
};
