import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { videoService } from '../services/videoService';

const Videos = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClassification, setFilterClassification] = useState('all');

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const storedUser = localStorage.getItem('auth_user');

        if (!storedUser) {
          navigate('/login');
          return;
        }

        const authUser = JSON.parse(storedUser);

        // Vérifier que l'utilisateur a le rôle jury
        if (authUser.role !== 'jury') {
          setError('Acces reserve aux membres du jury');
          return;
        }

        // Récupérer toutes les vidéos
        const response = await videoService.getAll();
        setVideos(response.data);

        setLoading(false);
      } catch (err) {
        console.log('[VIDEOS ERROR]', err);
        setError('Erreur lors du chargement des videos');
        setLoading(false);
      }
    };

    loadVideos();
  }, [navigate]);

  // Filtrage
  const filteredVideos = useMemo(() => {
    let result = [...videos];

    // Recherche par titre
    if (searchTerm) {
      result = result.filter(video =>
        video.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.author?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par classification
    if (filterClassification !== 'all') {
      result = result.filter(video => video.classification === filterClassification);
    }

    return result;
  }, [videos, searchTerm, filterClassification]);

  const handleVideoClick = (videoId) => {
    navigate(`/video/player?id=${videoId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-2 bg-white text-black rounded-xl"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 pt-24 pb-10">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Liste des videos</h1>
          <p className="text-gray-400">
            Total : <span className="font-bold text-white">{filteredVideos.length}</span> videos
          </p>
        </div>

        {/* Filtres et recherche */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Recherche */}
          <div className="space-y-2">
            <label className="text-xs text-gray-400">Rechercher</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Titre ou auteur..."
              className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-mars-primary/50"
            />
          </div>

          {/* Classification */}
          <div className="space-y-2">
            <label className="text-xs text-gray-400">Classification</label>
            <select
              value={filterClassification}
              onChange={(e) => setFilterClassification(e.target.value)}
              className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-mars-primary/50"
            >
              <option value="all">Toutes</option>
              <option value="ia">IA</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
        </div>

        {/* Grille de vidéos */}
        {filteredVideos.length === 0 ? (
          <p className="text-center text-gray-400 py-10">Aucune video trouvee</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <div
                key={video.id}
                onClick={() => handleVideoClick(video.id)}
                className="rounded-xl border border-white/10 bg-white/5 overflow-hidden hover:border-white/30 transition-all cursor-pointer group"
              >
                {/* Miniature */}
                <div className="relative w-full h-48 bg-black/40">
                  {video.cover ? (
                    <img
                      src={video.cover}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}

                  {/* Durée */}
                  {video.duration && (
                    <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/80 text-xs">
                      {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}
                    </div>
                  )}

                  {/* Badge classification */}
                  <div className="absolute top-2 left-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      video.classification === 'ia'
                        ? 'bg-purple-500/80 text-white'
                        : 'bg-orange-500/80 text-white'
                    }`}>
                      {video.classification?.toUpperCase() || 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Infos */}
                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-lg line-clamp-2 group-hover:text-mars-primary transition-colors">
                    {video.title || 'Sans titre'}
                  </h3>

                  {video.author && (
                    <p className="text-xs text-gray-400">Par {video.author}</p>
                  )}

                  {video.country && (
                    <p className="text-xs text-gray-400">{video.country}</p>
                  )}

                  {video.synopsis && (
                    <p className="text-sm text-gray-300 line-clamp-2 mt-2">
                      {video.synopsis}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Videos;
