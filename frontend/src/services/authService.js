import { API_URL } from '../config';

const parseResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.message || 'Erreur serveur');
  }
  return data;
};

export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

export const clearAuth = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
};

export const authService = {
  async validateInviteToken(token) {
    const response = await fetch(`${API_URL}/api/auth/invite/validate`, {
      headers: { 'X-Invite-Token': token },
    });
    return parseResponse(response);
  },

  async register(payload, inviteToken) {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Invite-Token': inviteToken,
      },
      body: JSON.stringify(payload),
    });
    return parseResponse(response);
  },

  async login(payload) {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return parseResponse(response);
  },
};
