import { useState, useCallback } from 'react';

export function useAuth() {
  const [logoutFlag, setLogoutFlag] = useState(false);

  const getAuth = () => {
    if (logoutFlag) return { user: null, token: null, isSelector: false, isAdmin: false };

    const token = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');

    if (!storedUser) return { user: null, token: null, isSelector: false, isAdmin: false };

    const user = JSON.parse(storedUser);
    const role = user.role;

    return {
      user,
      token,
      isSelector: role === 'jury' || role === 'admin' || role === 'superadmin',
      isAdmin: role === 'admin' || role === 'superadmin',
    };
  };

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setLogoutFlag(true);
  }, []);

  return { ...getAuth(), logout };
}
