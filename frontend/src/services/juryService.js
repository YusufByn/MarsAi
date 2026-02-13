const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function authHeaders() {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const juryService = {
  async getAll() {
    const response = await fetch(`${API_URL}/api/jury`);
    if (!response.ok) {
      throw new Error('Erreur lors de la recuperation des jurys');
    }
    return response.json();
  },

  async getById(id) {
    const response = await fetch(`${API_URL}/api/jury/${id}`);
    if (!response.ok) {
      throw new Error('Jury non trouve');
    }
    return response.json();
  },

  async create(juryData) {
    const response = await fetch(`${API_URL}/api/jury`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(juryData),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la creation du jury');
    }
    return response.json();
  },

  async update(id, juryData) {
    const response = await fetch(`${API_URL}/api/jury/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(juryData),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la mise a jour du jury');
    }
    return response.json();
  },

  async delete(id) {
    const response = await fetch(`${API_URL}/api/jury/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la suppression du jury');
    }
    return response.json();
  },
};
