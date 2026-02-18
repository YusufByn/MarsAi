import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { videoService } from '../services/videoService';
import { API_URL } from '../config';

const GENRE_FILTERS = [
  'Tous', 'Sci-Fi', 'Art Numérique', 'Animation',
  'Expérimental', 'Romance', 'Drame', 'Comédie', 'Thriller', 'Philosophique',
];

const Videos = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [filterGenre, setFilterGenre] = useState('Tous');
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

  useEffect(() => {
    if (searchTerm) {
      setSearchParams({ q: searchTerm }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }, [searchTerm, setSearchParams]);

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
        <div className="animate-pulse text-white/30 tracking-[0.3em] uppercase text-sm">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-400">{error}</p>
          <button onClick={() => navigate('/')} className="mars-button-outline">Retour</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-[1440px] mx-auto px-6 pt-28 pb-16">

        {/* Header */}
        <div className="mb-10 space-y-1">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter italic uppercase leading-[0.85]">
            EXPLORER
          </h1>
          <p className="text-white/30 text-sm tracking-widest uppercase">
            {filteredVideos.length} {filteredVideos.length !== 1 ? 'Œuvres' : 'Œuvre'}
          </p>
        </div>

        {/* Filters Row */}
        <div className="flex flex-col lg:flex-row gap-4 mb-10">
          {/* Search */}
          <div className="relative flex-shrink-0 w-full lg:w-72">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un film, un réalisateur..."
              className="w-full rounded-2xl bg-white/5 border border-white/10 pl-11 pr-4 py-3.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition"
            />
          </div>

          {/* Genre pills */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {GENRE_FILTERS.map((genre) => (
              <button
                key={genre}
                onClick={() => setFilterGenre(genre)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition whitespace-nowrap ${
                  filterGenre === genre
                    ? 'bg-white text-black'
                    : 'border border-white/10 text-white/40 hover:border-white/30 hover:text-white'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>

          {/* Classification */}
          <div className="flex gap-2 flex-shrink-0">
            {[
              { value: 'all', label: 'Tous types' },
              { value: 'ia', label: 'IA' },
              { value: 'hybrid', label: 'Hybrid' },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilterClassification(opt.value)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition whitespace-nowrap ${
                  filterClassification === opt.value
                    ? 'text-white'
                    : 'text-white/30 hover:text-white'
                }`}
                style={filterClassification === opt.value ? {
                  background: 'linear-gradient(135deg, #51A2FF, #AD46FF, #FF2B7F)',
                } : {}}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filteredVideos.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-white/20 text-xl tracking-widest uppercase">Aucune œuvre trouvée</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredVideos.map((video, index) => {
              const coverUrl = getCoverUrl(video.cover);
              const authorName = video.author ||
                [video.realisator_name, video.realisator_lastname].filter(Boolean).join(' ');
              const rank = index + 1;

              return (
                <div
                  key={video.id}
                  onClick={() => navigate(`/videoDetails/${video.id}`)}
                  className="group relative overflow-hidden cursor-pointer border border-white/10 hover:border-white/30 transition-all duration-500 hover:scale-[1.02]"
                  style={{ borderRadius: '32px', background: 'rgba(255,255,255,0.05)', boxShadow: '0px 25px 50px -12px rgba(0,0,0,0.25)' }}
                >
                  {/* Cover image */}
                  <div className="relative aspect-[9/14] overflow-hidden">
                    {coverUrl ? (
                      <img
                        src={coverUrl}
                        alt={video.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-mars-blue/10 via-mars-purple/5 to-mars-pink/10 flex items-center justify-center">
                        <svg className="w-12 h-12 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                    {/* Rank badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center">
                        <svg className="w-3 h-3 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z" />
                        </svg>
                      </div>
                      <span className="text-[10px] font-bold text-white/60 tracking-wider">#{rank}</span>
                    </div>

                    {/* Duration */}
                    {video.duration && (
                      <div className="absolute top-3 right-3 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-sm text-[10px] text-white/60 font-mono">
                        {formatDuration(video.duration)}
                      </div>
                    )}

                    {/* Classification badge */}
                    {video.classification && (
                      <div className="absolute bottom-3 left-3">
                        <span
                          className="px-2.5 py-1 text-[9px] font-bold text-white uppercase tracking-wider"
                          style={{
                            borderRadius: '14px',
                            background: video.classification === 'ia'
                              ? 'rgba(21, 93, 252, 0.8)'
                              : 'rgba(152, 16, 250, 0.8)',
                          }}
                        >
                          {video.classification.toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info panel */}
                  <div className="p-4 space-y-3 bg-white/[0.02]">
                    <h3 className="font-bold text-sm leading-tight line-clamp-2">
                      {video.title || 'Sans titre'}
                    </h3>

                    {authorName && (
                      <p className="text-white/40 text-xs">@{authorName}</p>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-4 pt-1">
                      <div className="flex items-center gap-1.5 text-white/30">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                        <span className="text-[11px] font-medium">—</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-white/30">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span className="text-[11px] font-medium">—</span>
                      </div>

                      {/* Tags */}
                      {video.tags && video.tags.length > 0 && (
                        <div className="flex gap-1 ml-auto">
                          {video.tags.slice(0, 2).map((tag) => (
                            <span key={tag.id} className="px-1.5 py-0.5 rounded text-[9px] bg-white/5 text-white/30">
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
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
