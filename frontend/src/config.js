import { getFingerprint } from './services/fingerprint.service';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export function authHeaders() {
  const token = localStorage.getItem('auth_token');
  const deviceId = getFingerprint();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(deviceId ? { 'x-device-id': deviceId } : {}),
  };
}
