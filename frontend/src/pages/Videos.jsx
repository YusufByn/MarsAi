import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { videoService } from '../services/videoService';
import { API_URL } from '../config';
import DeadlineCard from './home/HomeComponents/DeadlineCard';

const PAGE_SIZE = 24;

const Videos = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Données
  const [videos, setVideos]         = useState([]);
  const [meta, setMeta]             = useState({ total: 0, hasMore: false });
  const [offset, setOffset]         = useState(0);
  const [brokenCovers, setBrokenCovers] = useState(new Set());

  // Chargement
  const [loading, setLoading]         = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError]             = useState('');

  // Filtres
  const [searchTerm, setSearchTerm]               = useState(searchParams.get('q') || '');
  const [filterClassification, setFilterClassification] = useState('all');

  // Version du searchTerm réellement envoyée à l'API (débouncée)
  const [appliedSearch, setAppliedSearch] = useState(searchParams.get('q') || '');
  const debounceRef = useRef(null);

  // — Chargement initial / reset quand les filtres changent —
  useEffect(() => {

    let cancelled = false;

    const fetchPage = async () => {
      setLoading(true);
      try {
        const res = await videoService.getAll({
          limit: PAGE_SIZE,
          offset: 0,
          search: appliedSearch,
          classification: filterClassification,
        });
        if (!cancelled) {
          setVideos(res.data);
          setMeta(res.meta);
          setOffset(0);
        }
      } catch (err) {
        console.log('[VIDEOS ERROR]', err);
        if (!cancelled) setError('Erreur lors du chargement des videos');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchPage();
    return () => { cancelled = true; };
  }, [appliedSearch, filterClassification]);

  // — Chargement de la page suivante —
  const handleLoadMore = async () => {
    const nextOffset = offset + PAGE_SIZE;
    setLoadingMore(true);
    try {
      const res = await videoService.getAll({
        limit: PAGE_SIZE,
        offset: nextOffset,
        search: appliedSearch,
        classification: filterClassification,
      });
      setVideos(prev => [...prev, ...res.data]);
      setMeta(res.meta);
      setOffset(nextOffset);
    } catch (err) {
      console.log('[VIDEOS ERROR] load more:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  // — Searchbar : mise à jour locale immédiate, API débouncée (400 ms) —
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setAppliedSearch(value);
      setSearchParams(value ? { q: value } : {}, { replace: true });
    }, 400);
  };

  // — Sync depuis l'URL (recherche déclenchée depuis la navbar) —
  useEffect(() => {
    const q = searchParams.get('q') ?? '';
    if (q !== appliedSearch) {
      setSearchTerm(q);
      setAppliedSearch(q);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // — Helpers —
  const getCoverUrl = (video) => {
    const src = video.cover_url || (video.cover ? `/uploads/covers/${video.cover}` : null);
    if (!src) return null;
    if (src.startsWith('http')) return src;
    return `${API_URL}${src}`;
  };

  const formatDuration = (seconds) => {
    if (!seconds) return null;
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  };

  // — États d'erreur / chargement —
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
    { value: 'all',    label: 'Tous'   },
    { value: 'ia',     label: 'IA'     },
    { value: 'hybrid', label: 'Hybrid' },
  ];

  return (
    <div className="min-h-screen bg-black text-white px-6 pt-24 pb-10">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter italic">Films</h1>
            <p className="text-white/40 text-sm">
              {meta.total} video{meta.total !== 1 ? 's' : ''}
              {videos.length < meta.total && ` — ${videos.length} chargées`}
            </p>
          </div>

          <div className="sm:w-[320px]">
            <DeadlineCard />
          </div>
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
                onChange={handleSearchChange}
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
        {videos.length === 0 ? (
          <p className="text-center text-white/40 py-16">Aucune video trouvee</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => {
                const coverUrl   = getCoverUrl(video);
                const authorName = video.author || [video.realisator_name, video.realisator_lastname].filter(Boolean).join(' ');

                return (
                  <div
                    key={video.id}
                    onClick={() => navigate(`/videoDetails/${video.id}`)}
                    className="relative rounded-2xl overflow-hidden cursor-pointer group h-80 border border-white/10 hover:border-white/30 transition-all hover:scale-[1.02]"
                  >
                    {/* Image de fond */}
                    {coverUrl && !brokenCovers.has(video.id) ? (
                      <img
                        src={coverUrl}
                        alt={video.title}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={() => setBrokenCovers(prev => new Set(prev).add(video.id))}
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

            {/* Bouton charger plus */}
            {meta.hasMore && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-8 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-medium hover:bg-white/20 transition disabled:opacity-50"
                >
                  {loadingMore ? 'Chargement...' : `Charger plus (${meta.total - videos.length} restantes)`}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Videos;
