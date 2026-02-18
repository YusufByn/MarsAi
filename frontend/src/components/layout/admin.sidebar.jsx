import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { LayoutDashboard, Film, Users, Calendar, Settings, Mail, UserCog, Home, LogOut } from 'lucide-react';


export default function AdminSidebar({ user }) {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { label: 'DASHBOARD', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { label: 'GESTION FILMS', path: '/admin/films', icon: <Film size={20} /> },
    { label: 'JURY', path: '/admin/jury', icon: <Users size={20} /> },
    { label: 'EVENEMENTS', path: '/admin/events', icon: <Calendar size={20} /> },
    { label: 'CONFIGURATION', path: '/admin/config', icon: <Settings size={20} /> },
    { label: 'NEWSLETTER', path: '/admin/newsletter', icon: <Mail size={20} /> },
    { label: 'UTILISATEURS', path: '/admin/users', icon: <UserCog size={20} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    navigate('/login');
  };

  return (
    <div className="w-64 bg-[#1a1d21] text-gray-400 h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6">
        <h1 className="text-white font-bold text-xl tracking-wider">MARS.A.I</h1>
        <p className="text-xs text-gray-500 mt-1">Administration</p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                  : 'hover:bg-gray-800 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="text-xs font-bold tracking-wide">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-xs text-white font-bold">
            {user?.name?.[0]?.toUpperCase() || 'A'}
          </div>
          <div>
            <p className="text-white text-xs font-bold">
              {user?.name || 'Admin'} {user?.lastname || ''}
            </p>
            <p className="text-xs text-gray-500">{user?.role?.toUpperCase()}</p>
          </div>
        </div>
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2 w-full rounded-lg text-xs text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <Home size={16} />
          <span>Retour au site</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 w-full rounded-lg text-xs text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <LogOut size={16} />
          <span>Deconnexion</span>
        </button>
      </div>
    </div>
  );
}
