import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Film, Users, Calendar, Settings, Mail, UserCog, Home, LogOut, ShieldAlert, Handshake, X } from 'lucide-react';

export default function AdminSidebar({ user, isOpen = false, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { label: 'DASHBOARD',      path: '/admin/dashboard',  icon: <LayoutDashboard size={18} /> },
    { label: 'GESTION FILMS',  path: '/admin/films',      icon: <Film size={18} /> },
    { label: 'JURY',           path: '/admin/jury',       icon: <Users size={18} /> },
    { label: 'EVENEMENTS',     path: '/admin/events',     icon: <Calendar size={18} /> },
    { label: 'CONFIGURATION',  path: '/admin/config',     icon: <Settings size={18} /> },
    { label: 'NEWSLETTER',     path: '/admin/newsletter', icon: <Mail size={18} /> },
    { label: 'UTILISATEURS',   path: '/admin/users',      icon: <UserCog size={18} /> },
    { label: 'MONITORING',     path: '/admin/monitoring', icon: <ShieldAlert size={18} /> },
    { label: 'SPONSORS',       path: '/admin/sponsors',   icon: <Handshake size={18} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    navigate('/login');
  };

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  return (
    <aside
      className={`
        fixed left-0 top-0 h-screen w-64 z-[100]
        bg-[#1a1d21] text-gray-400
        flex flex-col
        transition-transform duration-300 ease-in-out
        /* Mobile : drawer slide-in */
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        /* Desktop : toujours visible */
        md:translate-x-0
      `}
    >
      {/* Header sidebar */}
      <div className="p-5 flex items-center justify-between">
        <div>
          <h1 className="text-white font-bold text-lg tracking-wider">MARS.A.I</h1>
          <p className="text-xs text-gray-500 mt-0.5">Administration</p>
        </div>
        {/* Bouton fermeture - mobile uniquement */}
        <button
          onClick={onClose}
          className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          aria-label="Fermer le menu"
        >
          <X size={16} className="text-white" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleLinkClick}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
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

      {/* Footer */}
      <div className="p-4 border-t border-gray-800 space-y-2">
        <div className="flex items-center gap-3 px-1 mb-3">
          <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-xs text-white font-bold flex-shrink-0">
            {user?.name?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-bold truncate">
              {user?.name || 'Admin'} {user?.lastname || ''}
            </p>
            <p className="text-xs text-gray-500">{user?.role?.toUpperCase()}</p>
          </div>
        </div>
        <Link
          to="/"
          onClick={handleLinkClick}
          className="flex items-center gap-2 px-3 py-2 w-full rounded-lg text-xs text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <Home size={15} />
          <span>Retour au site</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 w-full rounded-lg text-xs text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <LogOut size={15} />
          <span>Deconnexion</span>
        </button>
      </div>
    </aside>
  );
}
