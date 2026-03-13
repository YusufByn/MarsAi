import { API_URL, authHeaders } from '../config';

export const playerService = {
  async getAssignedVideos() {
    const response = await fetch(`${API_URL}/api/player/assigned`, {
      headers: authHeaders(),
    });
    if (!response.ok) {
      throw new Error('Erreur lors du chargement des videos assignees');
    }
    return response.json();
  },

  async getVideoFeed(userId, limit = 10) {
    const response = await fetch(`${API_URL}/api/player/videos?userId=${userId}&limit=${limit}`, {
      headers: authHeaders(),
    });
    if (!response.ok) {
      throw new Error('Erreur lors du chargement des videos');
    }
    return response.json();
  },

  async getMemo(videoId) {
    const response = await fetch(`${API_URL}/api/memo/${videoId}`, {
      headers: authHeaders(),
    });
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throw new Error('Erreur lors du chargement du memo');
    }
    return response.json();
  },

  async saveMemo(payload) {
    const response = await fetch(`${API_URL}/api/memo`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la sauvegarde du memo');
    }
    return response.json();
  },

  async getRating(videoId) {
    const response = await fetch(`${API_URL}/api/rating/${videoId}`, {
      headers: authHeaders(),
    });
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throw new Error('Erreur lors du chargement de la note');
    }
    return response.json();
  },

  async saveRating(payload) {
    const response = await fetch(`${API_URL}/api/rating`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la sauvegarde de la note');
    }
    return response.json();
  },

  async deleteRating(videoId) {
    const response = await fetch(`${API_URL}/api/rating/${videoId}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la suppression de la note');
    }
    return response.json();
  },

  async sendEmailToCreator(payload) {
    const response = await fetch(`${API_URL}/api/player/send-email`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de l\'envoi de l\'email');
    }
    return response.json();
  },
};
