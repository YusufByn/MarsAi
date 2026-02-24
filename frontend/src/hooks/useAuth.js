import { useState, useCallback } from 'react';
import { isTokenExpired, clearAuth } from '../services/authService';

export function useAuth() {
  const [logoutFlag, setLogoutFlag] = useState(false);

  const getAuth = () => {
    if (logoutFlag) return { user: null, token: null, isSelector: false, isAdmin: false };

    const token = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');

    if (!storedUser || !token || isTokenExpired(token)) {
      clearAuth();
      return { user: null, token: null, isSelector: false, isAdmin: false };
    }

    const user = JSON.parse(storedUser);
    const role = user.role;

    return {
      user,
      token,
      isSelector: role === 'jury' || role === 'selector' || role === 'admin' || role === 'superadmin',
      isAdmin: role === 'admin' || role === 'superadmin',
    };
  };

  const logout = useCallback(() => {
    clearAuth();
    setLogoutFlag(true);
  }, []);

  return { ...getAuth(), logout };
}
