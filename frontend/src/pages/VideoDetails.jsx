import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { videoService } from '../services/videoService';
import { API_URL } from '../config';

const SOCIAL_ICONS = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  x: 'X (Twitter)',
  linkedin: 'LinkedIn',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  website: 'Site web',
};

const VideoDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [coverBroken, setCoverBroken] = useState(false);
  const [brokenStills, setBrokenStills] = useState(new Set());

  useEffect(() => {
    const loadVideo = async () => {
      try {
        const response = await videoService.getById(id);
        setVideo(response.data);
        setLoading(false);
      } catch (err) {
        console.log('[VIDEO DETAILS ERROR]', err);
        setError('Video introuvable');
        setLoading(false);
      }
    };
    loadVideo();
  }, [id]);

  const formatDuration = (seconds) => {
    if (!seconds) return null;
    const m = Math.floor(seconds / 60);
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}min ${s}s`;
  };

  const getCoverUrl = (v) => {
    const src = v.cover_url || (v.cover ? `/uploads/covers/${v.cover}` : null);
    if (!src) return null;
    if (src.startsWith('http')) return src;
    return `${API_URL}${src}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse text-white/50">Chargement...</div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-400 text-lg">{error || 'Video introuvable'}</p>
          <button
            onClick={() => navigate('/videos')}
            className="px-6 py-2 bg-white text-black rounded-xl hover:bg-white/90 transition"
          >
            Retour aux videos
          </button>
        </div>
      </div>
    );
  }

  const coverUrl = getCoverUrl(video);
  const fullName = [video.realisator_name, video.realisator_lastname].filter(Boolean).join(' ');
  const validStills = video.stills?.filter(s => !brokenStills.has(s.id)) ?? [];

  return (
    <div className="min-h-screen bg-black text-white">

      {/* ===== HERO ===== */}
      <div className="relative h-[40vh] lg:h-[60vh] w-full overflow-hidden">
        {coverUrl && !coverBroken ? (
          <img
            src={coverUrl}
            alt={video.title}
            className="w-full h-full object-cover"
            onError={() => setCoverBroken(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-mars-primary/20 to-black flex items-center justify-center">
            <svg className="w-24 h-24 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 lg:px-10 lg:pb-12 max-w-7xl mx-auto">
          <div className="max-w-3xl">
            {video.classification && (
              <span className={`inline-block mb-3 px-3 py-1 rounded-full text-xs font-bold ${
                video.classification === 'ia'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
              }`}>
                {video.classification.toUpperCase()}
              </span>
            )}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
              {video.title || 'Sans titre'}
            </h1>
            {fullName && (
              <p className="text-white/60 text-base lg:text-lg mt-2">par {fullName}</p>
            )}
          </div>
        </div>

        <button
          onClick={() => navigate('/videos')}
          className="absolute top-6 left-6 z-10 flex items-center gap-2 px-4 py-2 rounded-xl bg-black/50 backdrop-blur-sm border border-white/10 text-white/80 hover:text-white hover:border-white/30 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour
        </button>
      </div>

      {/* ===== CONTENU PRINCIPAL ===== */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        <div className="lg:grid lg:grid-cols-[1fr_340px] lg:gap-12 lg:items-start">

          {/* ---- COLONNE PRINCIPALE ---- */}
          <div className="space-y-8">

            {/* Stills - mobile uniquement */}
            {validStills.length > 0 && (
              <div className="lg:hidden flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                {validStills.map((still) => (
                  <div key={still.id} className="flex-shrink-0 w-48 h-32 rounded-xl overflow-hidden border border-white/10">
                    <img
                      src={still.file_url ? `${API_URL}${still.file_url}` : `${API_URL}/uploads/stills/${still.file_name}`}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={() => setBrokenStills(prev => new Set(prev).add(still.id))}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* 01 - A propos */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <span className="text-mars-primary">01</span>
                A propos
              </h2>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
                {video.synopsis && (
                  <p className="text-white/70 text-sm leading-relaxed">{video.synopsis}</p>
                )}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm pt-2 border-t border-white/5">
                  {video.duration && (
                    <div>
                      <p className="text-white/40 text-xs mb-0.5">Duree</p>
                      <p className="text-white font-medium">{formatDuration(video.duration)}</p>
                    </div>
                  )}
                  {video.country && (
                    <div>
                      <p className="text-white/40 text-xs mb-0.5">Pays</p>
                      <p className="text-white font-medium">{video.country}</p>
                    </div>
                  )}
                  {video.language && (
                    <div>
                      <p className="text-white/40 text-xs mb-0.5">Langue</p>
                      <p className="text-white font-medium">{video.language}</p>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* 02 - Tags */}
            {video.tags && video.tags.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <span className="text-mars-primary">02</span>
                  Tags
                </h2>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div className="flex flex-wrap gap-2">
                    {video.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="px-3 py-1.5 rounded-full text-xs font-medium bg-mars-primary/10 text-mars-primary border border-mars-primary/20"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* 03 - Resume technique */}
            {video.tech_resume && (
              <section className="space-y-4">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <span className="text-mars-primary">03</span>
                  Resume technique
                </h2>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <p className="text-white/70 text-sm leading-relaxed whitespace-pre-line">{video.tech_resume}</p>
                </div>
              </section>
            )}

            {/* 04 - Resume creatif */}
            {video.creative_resume && (
              <section className="space-y-4">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <span className="text-mars-primary">04</span>
                  Resume creatif
                </h2>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <p className="text-white/70 text-sm leading-relaxed whitespace-pre-line">{video.creative_resume}</p>
                </div>
              </section>
            )}

            {/* Reseaux sociaux - mobile uniquement */}
            {video.social_media && video.social_media.length > 0 && (
              <section className="lg:hidden space-y-4">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <span className="text-mars-primary">05</span>
                  Reseaux sociaux
                </h2>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {video.social_media.map((sm) => (
                      <SocialLink key={sm.id} sm={sm} />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* CTA - mobile uniquement */}
            <div className="lg:hidden pt-2">
              <button
                onClick={() => navigate(`/video/player?id=${video.id}`)}
                className="w-full px-8 py-4 rounded-2xl bg-mars-primary text-white font-bold text-lg hover:bg-mars-primary/90 transition"
              >
                Voir dans le player
              </button>
            </div>
          </div>

          {/* ---- SIDEBAR DESKTOP ---- */}
          <div className="hidden lg:flex flex-col gap-5 sticky top-6">

            {/* Stills - grille desktop */}
            {validStills.length > 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
                <p className="text-xs font-bold tracking-widest text-white/40 uppercase">Photos</p>
                <div className="grid grid-cols-2 gap-2">
                  {validStills.map((still) => (
                    <div key={still.id} className="aspect-video rounded-xl overflow-hidden border border-white/10">
                      <img
                        src={still.file_url ? `${API_URL}${still.file_url}` : `${API_URL}/uploads/stills/${still.file_name}`}
                        alt=""
                        className="w-full h-full object-cover hover:scale-105 transition duration-300"
                        onError={() => setBrokenStills(prev => new Set(prev).add(still.id))}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Realisateur - desktop */}
            {fullName && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
                <p className="text-xs font-bold tracking-widest text-white/40 uppercase">Realisateur</p>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-white/40 text-xs mb-0.5">Nom complet</p>
                    <p className="text-white font-medium">{fullName}</p>
                  </div>
                  {video.realisator_gender && (
                    <div>
                      <p className="text-white/40 text-xs mb-0.5">Genre</p>
                      <p className="text-white font-medium">{video.realisator_gender}</p>
                    </div>
                  )}
                  {video.email && (
                    <div>
                      <p className="text-white/40 text-xs mb-0.5">Email</p>
                      <a href={`mailto:${video.email}`} className="text-mars-primary hover:underline break-all text-xs">{video.email}</a>
                    </div>
                  )}
                  {video.mobile_number && (
                    <div>
                      <p className="text-white/40 text-xs mb-0.5">Telephone</p>
                      <p className="text-white font-medium">{video.mobile_number}</p>
                    </div>
                  )}
                  {video.address && (
                    <div>
                      <p className="text-white/40 text-xs mb-0.5">Adresse</p>
                      <p className="text-white font-medium">{video.address}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Reseaux sociaux - desktop */}
            {video.social_media && video.social_media.length > 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
                <p className="text-xs font-bold tracking-widest text-white/40 uppercase">Reseaux sociaux</p>
                <div className="space-y-2">
                  {video.social_media.map((sm) => (
                    <SocialLink key={sm.id} sm={sm} />
                  ))}
                </div>
              </div>
            )}

            {/* CTA - desktop */}
            <button
              onClick={() => navigate(`/video/player?id=${video.id}`)}
              className="w-full px-8 py-4 rounded-2xl bg-mars-primary text-white font-bold text-lg hover:bg-mars-primary/90 transition"
            >
              Voir dans le player
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

function SocialLink({ sm }) {
  return (
    <a
      href={sm.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-mars-primary/30 hover:bg-mars-primary/5 transition group"
    >
      <span className="text-mars-primary font-medium text-sm">
        {SOCIAL_ICONS[sm.platform] || sm.platform}
      </span>
      <span className="text-white/50 text-xs truncate flex-1">{sm.url}</span>
      <svg className="w-4 h-4 text-white/30 group-hover:text-mars-primary transition flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </a>
  );
}

export default VideoDetails;
