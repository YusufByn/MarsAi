const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const playerService = {
  async getVideoFeed(userId, limit = 10) {
    const response = await fetch(`${API_URL}/api/player/videos?userId=${userId}&limit=${limit}`);
    if (!response.ok) {
      throw new Error('Erreur lors du chargement des videos');
    }
    return response.json();
  },

  async getMemo(videoId, userId) {
    const response = await fetch(`${API_URL}/api/memo/${videoId}/${userId}`);
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la sauvegarde du memo');
    }
    return response.json();
  },

  async getRating(videoId, userId) {
    const response = await fetch(`${API_URL}/api/rating/${videoId}/${userId}`);
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la sauvegarde de la note');
    }
    return response.json();
  },

  async sendEmailToCreator(payload) {
    const response = await fetch(`${API_URL}/api/player/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de l\'envoi de l\'email');
    }
    return response.json();
  },

  async togglePlaylist(videoId, userId, addToPlaylist) {
    const response = await fetch(`${API_URL}/api/player/playlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ video_id: videoId, user_id: userId, playlist: addToPlaylist }),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la mise à jour de la playlist');
    }
    return response.json();
  },
};
