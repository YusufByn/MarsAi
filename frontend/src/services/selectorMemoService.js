import { API_URL, authHeaders } from '../config';

export const selectorMemoService = {
  async getAllByUser() {
    const response = await fetch(`${API_URL}/api/memo/user/me`, {
      headers: authHeaders(),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des memos');
    }
    return response.json();
  },

  async getOne(videoId) {
    const response = await fetch(`${API_URL}/api/memo/${videoId}`, {
      headers: authHeaders(),
    });
    if (!response.ok) {
      throw new Error('Memo not found');
    }
    return response.json();
  },

  async upsert(memoData) {
    const response = await fetch(`${API_URL}/api/memo`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(memoData),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la sauvegarde du memo');
    }
    return response.json();
  },
};
