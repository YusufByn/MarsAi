import React, { useState, useEffect } from 'react';
import { User, Zap, Clock, MapPin, Download, Edit } from 'lucide-react';

export default function AdminEvents() {
    const [events, setEvents] = useState([]);
    // Données factices pour l'exemple visuel (à remplacer par ton fetch API)
    const stats = {
        totalReservations: 245,
        dailyIncrease: 12,
        fillRate: 78
    };

    useEffect(() => {
        // Fetch API ici : GET /api/admin/events
        // Pour l'instant, on mock selon ta DB :
        setEvents([
            {
                id: 1,
                title: "MASTERCLASS: PROMPT ENGINEERING VIDEO",
                description: "Apprenez à maîtriser la cohérence temporelle...",
                coach: "Jean Dupond AI Lab", // Champ 'created_by' ou spécifique
                date: "2026-05-17T10:00:00",
                duration: 120,
                location: "AUDITORIUM MUCEM",
                stock: 50,
                registered: 12 // Calculé via table reservation
            },
            {
                id: 2,
                title: "ATELIER: MUSIQUE & IA GÉNÉRATIVE",
                description: "Composition assistée par IA...",
                coach: "Sora Music Team",
                date: "2026-05-17T14:00:00",
                duration: 120,
                location: "STUDIO 1 - FRICHE BELLE DE MAI",
                stock: 20,
                registered: 16
            }
        ]);
    }, []);

    return (
        <div className="p-8 bg-gray-50 min-h-screen ml-64"> {/* Marge pour la sidebar */}
            
            {/* STATS CARDS */}
            <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <User size={32} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">RÉSERVATIONS TOTALES</p>
                        <p className="text-4xl font-bold text-gray-900 mt-1">{stats.totalReservations}</p>
                        <p className="text-xs text-blue-600 font-medium mt-1">+{stats.dailyIncrease} AUJOURD'HUI</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                        <Zap size={32} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">TAUX DE REMPLISSAGE</p>
                        <p className="text-4xl font-bold text-gray-900 mt-1">{stats.fillRate}%</p>
                        <p className="text-xs text-gray-400 font-medium mt-1">GLOBAL WORKSHOPS</p>
                    </div>
                </div>
            </div>

            {/* TAB SELECTOR */}
            <div className="bg-gray-200 p-1 rounded-lg inline-flex mb-8">
                <button className="bg-white text-blue-900 px-6 py-2 rounded-md text-xs font-bold shadow-sm">VENDREDI 17 MAI</button>
                <button className="text-gray-500 px-6 py-2 rounded-md text-xs font-bold hover:text-gray-700">SAMEDI 18 MAI</button>
            </div>

            {/* LISTE EVENTS */}
            <div className="space-y-6">
                {events.map(evt => (
                    <div key={evt.id} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center text-gray-400 text-xs font-bold mb-2 gap-4">
                            <span className="flex items-center gap-2"><Clock size={14}/> {new Date(evt.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{evt.title}</h3>
                        
                        <div className="flex items-center gap-2 text-blue-600 text-sm font-bold mb-4">
                            <User size={16} /> 
                            <span>Coach: {evt.coach}</span>
                        </div>

                        <p className="text-gray-500 text-sm mb-6">{evt.description}</p>
                        
                        <div className="grid grid-cols-2 gap-8 mb-6">
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase mb-1">NOMBRE D'INSCRIPTIONS</p>
                                <p className="text-gray-900 font-bold">{evt.registered} / {evt.stock}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase mb-1">LIEU</p>
                                <p className="text-blue-600 font-bold text-xs flex items-center gap-1">
                                    <MapPin size={12} /> {evt.location}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4 border-t border-gray-100 pt-6">
                            <button className="flex-1 border border-gray-200 rounded-lg py-3 flex items-center justify-center gap-2 text-xs font-bold text-gray-600 hover:bg-gray-50">
                                <Download size={16} /> LISTE PARTICIPANTS
                            </button>
                            <button className="flex-1 bg-gray-800 rounded-lg py-3 flex items-center justify-center gap-2 text-xs font-bold text-white hover:bg-gray-900">
                                <Edit size={16} /> MODIFIER
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}