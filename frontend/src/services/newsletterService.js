const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/newsletter`;

function authHeaders() {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const newsletterService = {
  async subscribe(email) {
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
  },

  async unsubscribe(email) {
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
  },

  async getCount() {
    const response = await fetch(`${API_URL}/count`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Une erreur est survenue');
    }

    return data;
  },

  /**
   * Aperçu du nombre de destinataires par type (admin)
   */
  async previewRecipients(recipients) {
    const response = await fetch(`${API_URL}/campaign/preview`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ recipients }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Une erreur est survenue');
    }

    return data;
  },

  /**
   * Envoyer une campagne newsletter (admin)
   */
  async sendCampaign(subject, message, recipients) {
    const response = await fetch(`${API_URL}/campaign/send`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ subject, message, recipients }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Une erreur est survenue');
    }

    return data;
  },
};
