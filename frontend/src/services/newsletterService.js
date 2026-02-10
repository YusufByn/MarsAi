const API_URL = 'http://localhost:4000/api/newsletter';

export const newsletterService = {
//la c'ets pour s'inscrire
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

//Systeme de désabonnement
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

  // ici c'est pour avoir l'ensemble des abonnés 
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

  /**
   * Aperçu du nombre de destinataires par type (admin)
   */
  async previewRecipients(recipients) {
    try {
      const response = await fetch(`${API_URL}/campaign/preview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recipients }),
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
   * Envoyer une campagne newsletter (admin)
   */
  async sendCampaign(subject, message, recipients) {
    try {
      const response = await fetch(`${API_URL}/campaign/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subject, message, recipients }),
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
};
