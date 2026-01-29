const API_URL = 'http://localhost:4000/api/newsletter';

export const newsletterService = {
  /**
   * S'inscrire à la newsletter
   */
  async subscribe(email) {
    try {
      const response = await fetch(`${API_URL}/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Une erreur est survenue');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Se désabonner de la newsletter
   */
  async unsubscribe(email) {
    try {
      const response = await fetch(`${API_URL}/unsubscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Une erreur est survenue');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Récupérer le nombre d'abonnés
   */
  async getCount() {
    try {
      const response = await fetch(`${API_URL}/count`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Une erreur est survenue');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },
};
