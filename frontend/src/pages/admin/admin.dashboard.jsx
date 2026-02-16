import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film, Calendar, Users, Mail, UserCheck, ClipboardList, Clock, CheckCircle, XCircle } from 'lucide-react';
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
    total_videos: 0, total_events: 0, pending_videos: 0,
    validated_videos: 0, rejected_videos: 0, recent_videos: [],
    total_users: 0, users_by_role: {}, total_evaluations: 0,
  });
  const [juryCount, setJuryCount] = useState(0);
  const [newsletterCount, setNewsletterCount] = useState(0);
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
    {
      label: 'Utilisateurs inscrits',
      value: stats.total_users,
      icon: <UserCheck size={24} />,
      color: 'cyan',
      link: '/admin/users',
    },
    {
      label: 'Evaluations selecteurs',
      value: stats.total_evaluations,
      icon: <ClipboardList size={24} />,
      color: 'orange',
    },
  ];

  const colorMap = {
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    yellow: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
    green: 'bg-green-500/10 border-green-500/20 text-green-400',
    red: 'bg-red-500/10 border-red-500/20 text-red-400',
    cyan: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
    purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    yellow: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
    cyan: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
    orange: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
  };

  const statusColor = {
    pending: 'bg-yellow-500/20 text-yellow-400',
    validated: 'bg-green-500/20 text-green-400',
    rejected: 'bg-red-500/20 text-red-400',
  };

  const statusLabel = {
    pending: 'En attente',
    validated: 'Validee',
    rejected: 'Rejetee',
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

      {/* Cartes principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Tag = card.link ? 'button' : 'div';
          return (
            <Tag
              key={card.label}
              onClick={card.link ? () => navigate(card.link) : undefined}
              className={`rounded-2xl border p-6 text-left transition-transform hover:scale-105 ${colorMap[card.color]} ${card.link ? 'cursor-pointer' : ''}`}
            >
              <div className="flex items-center justify-between mb-4">
                {card.icon}
              </div>
              <p className="text-3xl font-bold">{card.value}</p>
              <p className="text-xs text-gray-400 mt-1">{card.label}</p>
            </Tag>
          );
        })}
      </div>

      {/* Section stats détaillées */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Statut des vidéos */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-bold mb-4">Statut des videos</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-yellow-500/10">
              <div className="flex items-center gap-3">
                <Clock size={18} className="text-yellow-400" />
                <span className="text-sm">En attente</span>
              </div>
              <span className="text-xl font-bold text-yellow-400">{stats.pending_videos}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-green-500/10">
              <div className="flex items-center gap-3">
                <CheckCircle size={18} className="text-green-400" />
                <span className="text-sm">Validees</span>
              </div>
              <span className="text-xl font-bold text-green-400">{stats.validated_videos}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-red-500/10">
              <div className="flex items-center gap-3">
                <XCircle size={18} className="text-red-400" />
                <span className="text-sm">Rejetees</span>
              </div>
              <span className="text-xl font-bold text-red-400">{stats.rejected_videos}</span>
            </div>
          </div>
        </div>

        {/* Répartition utilisateurs par rôle */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-bold mb-4">Utilisateurs par role</h2>
          <div className="space-y-3">
            {Object.entries(stats.users_by_role || {}).map(([role, count]) => (
              <div key={role} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                <span className="text-sm capitalize">{role}</span>
                <span className="text-xl font-bold text-white">{count}</span>
              </div>
            ))}
            {(!stats.users_by_role || Object.keys(stats.users_by_role).length === 0) && (
              <p className="text-gray-500 text-sm">Aucune donnee</p>
            )}
          </div>
        </div>
      </div>

      {/* Dernières vidéos soumises */}
      {stats.recent_videos && stats.recent_videos.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-bold mb-4">Dernieres videos soumises</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-white/10">
                  <th className="pb-3 pr-4">Titre</th>
                  <th className="pb-3 pr-4">Realisateur</th>
                  <th className="pb-3 pr-4">Duree</th>
                  <th className="pb-3 pr-4">Classification</th>
                  <th className="pb-3 pr-4">Statut</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_videos.map((video) => (
                  <tr key={video.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 pr-4 font-medium">{video.title}</td>
                    <td className="py-3 pr-4 text-gray-400">{video.director}</td>
                    <td className="py-3 pr-4 text-gray-400">
                      {video.duration ? `${Math.floor(video.duration / 60)}min` : 'N/A'}
                    </td>
                    <td className="py-3 pr-4 text-gray-400">{video.classification || 'N/A'}</td>
                    <td className="py-3 pr-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusColor[video.status] || 'bg-gray-500/20 text-gray-400'}`}>
                        {statusLabel[video.status] || video.status}
                      </span>
                    </td>
                    <td className="py-3 text-gray-400">
                      {new Date(video.created_at).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
