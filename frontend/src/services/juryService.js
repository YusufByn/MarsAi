const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const juryService = {
  /**
   * Récupérer tous les jurys
   */
  async getAll() {
    const response = await fetch(`${API_URL}/api/jury`);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des jurys');
    }
    return response.json();
  },

  /**
   * Récupérer un jury par ID
   */
  async getById(id) {
    const response = await fetch(`${API_URL}/api/jury/${id}`);
    if (!response.ok) {
      throw new Error('Jury non trouvé');
    }
    return response.json();
  },

  /**
   * Créer un jury (superadmin)
   */
  async create(juryData) {
    const response = await fetch(`${API_URL}/api/jury`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(juryData),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la création du jury');
    }
    return response.json();
  },

  /**
   * Mettre à jour un jury (superadmin)
   */
  async update(id, juryData) {
    const response = await fetch(`${API_URL}/api/jury/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(juryData),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la mise à jour du jury');
    }
    return response.json();
  },

  /**
   * Supprimer un jury (superadmin)
   */
  async delete(id) {
    const response = await fetch(`${API_URL}/api/jury/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la suppression du jury');
    }
    return response.json();
  },
};
