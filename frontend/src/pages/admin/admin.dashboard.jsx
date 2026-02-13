import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film, Calendar, Users, Mail, Clock, CheckCircle, XCircle } from 'lucide-react';
import { adminService } from '../../services/adminService';

const statusBadge = (status) => {
  const map = {
    draft: 'bg-gray-500/20 text-gray-400',
    pending: 'bg-yellow-500/20 text-yellow-400',
    validated: 'bg-green-500/20 text-green-400',
    rejected: 'bg-red-500/20 text-red-400',
    banned: 'bg-red-800/20 text-red-600',
  };
  const labels = { draft: 'Brouillon', pending: 'En attente', validated: 'Valide', rejected: 'Rejete', banned: 'Banni' };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${map[status] || 'bg-gray-500/20 text-gray-400'}`}>
      {labels[status] || status}
    </span>
  );
};

const formatDuration = (seconds) => {
  if (!seconds) return 'N/A';
  const min = Math.floor(seconds / 60);
  return `${min}min`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total_videos: 0,
    pending_videos: 0,
    validated_videos: 0,
    rejected_videos: 0,
    recent_videos: [],
    total_events: 0,
    total_jury: 0,
    total_newsletter: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadStats = async () => {
      try {
        const dashStats = await adminService.getDashboardStats();
        if (cancelled) return;
        setStats(dashStats);
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
      label: 'Total videos',
      value: stats.total_videos,
      icon: <Film size={24} />,
      color: 'blue',
      link: '/admin/films',
    },
    {
      label: 'En attente',
      value: stats.pending_videos,
      icon: <Clock size={24} />,
      color: 'yellow',
      link: '/admin/films',
    },
    {
      label: 'Validees',
      value: stats.validated_videos,
      icon: <CheckCircle size={24} />,
      color: 'green',
      link: '/admin/films',
    },
    {
      label: 'Rejetees',
      value: stats.rejected_videos,
      icon: <XCircle size={24} />,
      color: 'red',
      link: '/admin/films',
    },
    {
      label: 'Evenements',
      value: stats.total_events,
      icon: <Calendar size={24} />,
      color: 'cyan',
      link: '/admin/events',
    },
    {
      label: 'Membres du jury',
      value: stats.total_jury,
      icon: <Users size={24} />,
      color: 'purple',
      link: '/admin/jury',
    },
    {
      label: 'Abonnes newsletter',
      value: stats.total_newsletter,
      icon: <Mail size={24} />,
      color: 'orange',
      link: '/admin/newsletter',
    },
  ];

  const colorMap = {
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    yellow: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
    green: 'bg-green-500/10 border-green-500/20 text-green-400',
    red: 'bg-red-500/10 border-red-500/20 text-red-400',
    cyan: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
    purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    orange: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
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

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <button
            key={card.label}
            onClick={() => navigate(card.link)}
            className={`rounded-2xl border p-5 text-left transition-transform hover:scale-105 ${colorMap[card.color]}`}
          >
            <div className="flex items-center justify-between mb-3">
              {card.icon}
            </div>
            <p className="text-3xl font-bold">{card.value}</p>
            <p className="text-xs text-gray-400 mt-1">{card.label}</p>
          </button>
        ))}
      </div>

      {/* Recent Videos */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Videos recentes</h2>
          <button
            onClick={() => navigate('/admin/films')}
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
          >
            Voir tout
          </button>
        </div>

        {stats.recent_videos.length === 0 ? (
          <p className="text-sm text-gray-500">Aucune video soumise</p>
        ) : (
          <div className="space-y-3">
            {stats.recent_videos.map((video) => (
              <div
                key={video.id}
                onClick={() => navigate('/admin/films')}
                className="rounded-xl border border-white/10 bg-white/5 p-4 hover:border-white/20 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  {video.poster_url ? (
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={video.poster_url} alt={video.title} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                      <Film size={20} className="text-gray-600" />
                    </div>
                  )}

                  <div className="flex-grow min-w-0">
                    <h3 className="font-bold text-sm truncate">{video.title || 'Sans titre'}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {video.director || 'N/A'} {video.country ? `- ${video.country}` : ''} {video.duration ? `- ${formatDuration(video.duration)}` : ''}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs text-gray-500 hidden md:block">{formatDate(video.created_at)}</span>
                    {statusBadge(video.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
