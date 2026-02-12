import React from 'react';
import { Link, useLocation } from 'react-router-dom';
// Icônes (installe lucide-react si besoin : npm i lucide-react)
import { LayoutDashboard, Film, Users, Trophy, Calendar, Settings } from 'lucide-react';

export default function AdminSidebar() {
    const location = useLocation();
    
    const menuItems = [
        { label: "DASHBOARD", path: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
        { label: "GESTION FILMS", path: "/admin/films", icon: <Film size={20} /> },
        { label: "JURY", path: "/admin/jury", icon: <Users size={20} /> },
        { label: "RÉSULTATS", path: "/admin/results", icon: <Trophy size={20} /> },
        { label: "ÉVÈNEMENTS", path: "/admin/events", icon: <Calendar size={20} /> },
        { label: "CONFIGURATION", path: "/admin/config", icon: <Settings size={20} /> },
    ];

    return (
        <div className="w-64 bg-[#1a1d21] text-gray-400 h-screen fixed left-0 top-0 flex flex-col">
            <div className="p-6">
                <h1 className="text-white font-bold text-xl tracking-wider">MARS.A.I</h1>
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
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50" 
                                : "hover:bg-gray-800 hover:text-white"
                            }`}
                        >
                            {item.icon}
                            <span className="text-xs font-bold tracking-wide">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-800">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-600 overflow-hidden">
                        <img src="https://ui-avatars.com/api/?name=Admin" alt="Admin" />
                    </div>
                    <div>
                        <p className="text-white text-xs font-bold">ADMINISTRATEUR</p>
                        <p className="text-xs text-gray-500">admin@email.com</p>
                    </div>
                </div>
            </div>
        </div>
    );
}