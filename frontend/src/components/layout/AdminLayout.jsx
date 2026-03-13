import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AdminSidebar from './admin.sidebar';
import { isTokenExpired, clearAuth } from '../../services/authService';

export default function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

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

      {/* Barre top mobile */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-[90] h-14 bg-[#1a1d21] border-b border-gray-800 flex items-center px-4 gap-3">
        <button
          onClick={() => setMenuOpen(true)}
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          aria-label="Ouvrir le menu"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="text-white font-bold text-sm tracking-wider">MARS.A.I</span>
      </div>

      {/* Overlay backdrop mobile */}
      {menuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 z-[95] backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <AdminSidebar
        user={user}
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      {/* Contenu principal */}
      <main className="flex-1 md:ml-64 p-6 md:p-8 pt-20 md:pt-8 text-white min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
