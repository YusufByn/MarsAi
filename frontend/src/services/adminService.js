const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/admin`;

function authHeaders() {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const adminService = {
  // --- Dashboard ---
  async getDashboardStats() {
    const response = await fetch(`${API_URL}/stats`, {
      headers: authHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erreur stats');
    return data;
  },

  // --- Videos ---
  async listVideos({ page = 1, limit = 10, search = '', status = '' } = {}) {
    const params = new URLSearchParams({ page, limit, search, status });
    const response = await fetch(`${API_URL}/videos?${params}`, {
      headers: authHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erreur videos');
    return data;
  },

  async updateVideoStatus(id, status) {
    const response = await fetch(`${API_URL}/videos/${id}/status`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ status }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erreur update status');
    return data;
  },

  async deleteVideo(id) {
    const response = await fetch(`${API_URL}/videos/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erreur suppression');
    return data;
  },

  // --- Events ---
  async listEvents() {
    const response = await fetch(`${API_URL}/events`, {
      headers: authHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erreur events');
    return data;
  },

  async createEvent(eventData) {
    const response = await fetch(`${API_URL}/events`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(eventData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erreur creation event');
    return data;
  },

  async deleteEvent(id) {
    const response = await fetch(`${API_URL}/events/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erreur suppression event');
    return data;
  },

  // --- CMS ---
  async getCms() {
    const response = await fetch(`${API_URL}/cms`, {
      headers: authHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erreur CMS');
    return data;
  },

  async updateCms(sectionType, payload) {
    const response = await fetch(`${API_URL}/cms/${sectionType}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erreur update CMS');
    return data;
  },

  // --- Users ---
  async listUsers() {
    const response = await fetch(`${API_URL}/users`, {
      headers: authHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erreur utilisateurs');
    return data;
  },

  async createUser(userData) {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erreur creation utilisateur');
    return data;
  },

  async updateUser(id, userData) {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erreur mise a jour utilisateur');
    return data;
  },

  async deleteUser(id) {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erreur suppression utilisateur');
    return data;
  },
};
