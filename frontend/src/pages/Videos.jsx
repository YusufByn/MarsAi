import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { videoService } from '../services/videoService';
import { API_URL } from '../config';

const Videos = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [filterClassification, setFilterClassification] = useState('all');

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedUser = localStorage.getItem('auth_user');

        if (!storedUser) {
          navigate('/login');
          return;
        }

        const authUser = JSON.parse(storedUser);
        const allowedRoles = ['jury', 'admin', 'superadmin'];
        if (!allowedRoles.includes(authUser.role)) {
          setError('Acces reserve aux membres du jury');
          setLoading(false);
          return;
        }

        const videosRes = await videoService.getAll();
        setVideos(videosRes.data);
        setLoading(false);
      } catch (err) {
        console.log('[VIDEOS ERROR]', err);
        setError('Erreur lors du chargement des videos');
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  // Synchroniser le query param q avec le searchTerm
  useEffect(() => {
    if (searchTerm) {
      setSearchParams({ q: searchTerm }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }, [searchTerm, setSearchParams]);

  // Mettre a jour searchTerm si le query param change (navigation depuis la navbar)
  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null && q !== searchTerm) {
      setSearchTerm(q);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const filteredVideos = useMemo(() => {
    let result = [...videos];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (video) =>
          video.title?.toLowerCase().includes(term) ||
          video.author?.toLowerCase().includes(term) ||
          video.realisator_name?.toLowerCase().includes(term) ||
          video.realisator_lastname?.toLowerCase().includes(term) ||
          (video.tags && video.tags.some((tag) => tag.name?.toLowerCase().includes(term)))
      );
    }

    if (filterClassification !== 'all') {
      result = result.filter((video) => video.classification === filterClassification);
    }

    return result;
  }, [videos, searchTerm, filterClassification]);

  const getCoverUrl = (cover) => {
    if (!cover) return null;
    if (cover.startsWith('http')) return cover;
    return `${API_URL}/uploads/covers/${cover}`;
  };

  const formatDuration = (seconds) => {
    if (!seconds) return null;
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse text-white/50">Chargement...</div>
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

  const classificationOptions = [
    { value: 'all', label: 'Tous' },
    { value: 'ia', label: 'IA' },
    { value: 'hybrid', label: 'Hybrid' },
  ];

  return (
    <div className="min-h-screen bg-black text-white px-6 pt-24 pb-10">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter italic">
            Films
          </h1>
          <p className="text-white/40 text-sm">
            {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Barre de filtres */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Searchbar */}
          <div className="space-y-2">
            <label className="text-xs text-white/40">Rechercher</label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Titre, realisateur ou tag..."
                className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-mars-primary/50 focus:border-mars-primary/50 transition"
              />
            </div>
          </div>

          {/* Classification pills */}
          <div className="space-y-2">
            <label className="text-xs text-white/40">Classification</label>
            <div className="flex gap-2">
              {classificationOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setFilterClassification(opt.value)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition ${
                    filterClassification === opt.value
                      ? 'bg-mars-primary text-white'
                      : 'bg-white/5 border border-white/10 text-white/60 hover:border-white/30 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grille de videos */}
        {filteredVideos.length === 0 ? (
          <p className="text-center text-white/40 py-16">Aucune video trouvee</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => {
              const coverUrl = getCoverUrl(video.cover);
              const authorName = video.author || [video.realisator_name, video.realisator_lastname].filter(Boolean).join(' ');

              return (
                <div
                  key={video.id}
                  onClick={() => navigate(`/videoDetails/${video.id}`)}
                  className="relative rounded-2xl overflow-hidden cursor-pointer group h-80 border border-white/10 hover:border-white/30 transition-all hover:scale-[1.02]"
                >
                  {/* Image de fond */}
                  {coverUrl ? (
                    <img
                      src={coverUrl}
                      alt={video.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black flex items-center justify-center">
                      <svg className="w-16 h-16 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}

                  {/* Glassmorphism overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                  {/* Badge classification */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-sm ${
                      video.classification === 'ia'
                        ? 'bg-purple-500/30 text-purple-200 border border-purple-400/30'
                        : 'bg-orange-500/30 text-orange-200 border border-orange-400/30'
                    }`}>
                      {video.classification?.toUpperCase() || 'N/A'}
                    </span>
                  </div>

                  {/* Duree */}
                  {video.duration && (
                    <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-xs text-white/80">
                      {formatDuration(video.duration)}
                    </div>
                  )}

                  {/* Infos en bas */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
                    <h3 className="font-bold text-lg text-white line-clamp-2 leading-tight">
                      {video.title || 'Sans titre'}
                    </h3>

                    {authorName && (
                      <p className="text-white/60 text-xs">{authorName}</p>
                    )}

                    {/* Tags */}
                    {video.tags && video.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {video.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag.id}
                            className="px-2 py-0.5 rounded-full text-[10px] bg-white/10 text-white/60 backdrop-blur-sm"
                          >
                            {tag.name}
                          </span>
                        ))}
                        {video.tags.length > 3 && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/10 text-white/40">
                            +{video.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Videos;
