import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AdminSidebar from './admin.sidebar';
import { isTokenExpired, clearAuth } from '../../services/authService';

export default function AdminLayout() {
  const token = localStorage.getItem('auth_token');
  const storedUser = localStorage.getItem('auth_user');

  if (!storedUser || !token || isTokenExpired(token)) {
    clearAuth();
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(storedUser);

  if (user.role !== 'admin' && user.role !== 'superadmin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen bg-black">
      <AdminSidebar user={user} />
      <main className="flex-1 ml-64 p-8 text-white">
        <Outlet />
      </main>
    </div>
  );
}
