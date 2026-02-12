import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film, Calendar, Users, Mail } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { juryService } from '../../services/juryService';
import { newsletterService } from '../../services/newsletterService';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total_videos: 0, total_events: 0 });
  const [juryCount, setJuryCount] = useState(0);
  const [newsletterCount, setNewsletterCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadStats = async () => {
      try {
        const [dashStats, juryData, nlCount] = await Promise.all([
          adminService.getDashboardStats(),
          juryService.getAll(),
          newsletterService.getCount(),
        ]);

        if (cancelled) return;
        setStats(dashStats);
        setJuryCount(juryData.data?.length || 0);
        setNewsletterCount(nlCount.data?.count || 0);
      } catch (error) {
        console.error('[DASHBOARD] Erreur chargement stats:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadStats();
    return () => { cancelled = true; };
  }, []);

  const cards = [
    {
      label: 'Videos soumises',
      value: stats.total_videos,
      icon: <Film size={24} />,
      color: 'blue',
      link: '/admin/films',
    },
    {
      label: 'Evenements',
      value: stats.total_events,
      icon: <Calendar size={24} />,
      color: 'green',
      link: '/admin/events',
    },
    {
      label: 'Membres du jury',
      value: juryCount,
      icon: <Users size={24} />,
      color: 'purple',
      link: '/admin/jury',
    },
    {
      label: 'Abonnes newsletter',
      value: newsletterCount,
      icon: <Mail size={24} />,
      color: 'yellow',
      link: '/admin/newsletter',
    },
  ];

  const colorMap = {
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    green: 'bg-green-500/10 border-green-500/20 text-green-400',
    purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    yellow: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <button
            key={card.label}
            onClick={() => navigate(card.link)}
            className={`rounded-2xl border p-6 text-left transition-transform hover:scale-105 ${colorMap[card.color]}`}
          >
            <div className="flex items-center justify-between mb-4">
              {card.icon}
            </div>
            <p className="text-3xl font-bold">{card.value}</p>
            <p className="text-xs text-gray-400 mt-1">{card.label}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
