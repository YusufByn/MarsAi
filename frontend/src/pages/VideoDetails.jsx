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
    return `${m}:${s}`;
  };

  const getCoverUrl = (cover) => {
    if (!cover) return null;
    if (cover.startsWith('http')) return cover;
    return `${API_URL}/uploads/covers/${cover}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse text-white/30 tracking-[0.3em] uppercase text-sm">Chargement...</div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-400">{error || 'Video introuvable'}</p>
          <button onClick={() => navigate('/videos')} className="mars-button-outline">
            Retour aux films
          </button>
        </div>
      </div>
    );
  }

  const coverUrl = getCoverUrl(video.cover);
  const fullName = [video.realisator_name, video.realisator_lastname].filter(Boolean).join(' ');
  const aiTools = video.tags?.filter(t => ['midjourney', 'runway', 'elevenlabs', 'sora', 'stable diffusion', 'chatgpt'].includes(t.name?.toLowerCase())) || [];
  const regularTags = video.tags?.filter(t => !aiTools.some(a => a.id === t.id)) || [];

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Bouton retour */}
      <div className="fixed top-24 left-6 z-50">
        <button
          onClick={() => navigate('/videos')}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/70 backdrop-blur-sm border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour
        </button>
      </div>

      {/* Layout principal */}
      <div className="max-w-[1440px] mx-auto px-6 pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8">

          {/* ── COLONNE GAUCHE — Carte film + stats ─────────────────── */}
          <div className="space-y-5">

            {/* Carte film principale */}
            <div className="rounded-3xl overflow-hidden border border-white/10 glass-card">
              {/* Cover */}
              <div className="relative aspect-[9/12]">
                {coverUrl ? (
                  <img src={coverUrl} alt={video.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-mars-blue/10 via-mars-purple/5 to-mars-pink/10 flex items-center justify-center">
                    <svg className="w-16 h-16 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Badges overlay */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {video.classification && (
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold border ${
                      video.classification === 'ia'
                        ? 'bg-mars-blue/20 text-mars-blue border-mars-blue/20'
                        : 'bg-mars-purple/20 text-mars-purple border-mars-purple/20'
                    }`}>
                      {video.classification.toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Duration */}
                {video.duration && (
                  <div className="absolute top-4 right-4 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-xs font-mono text-white/60">
                    {formatDuration(video.duration)}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-5 space-y-3">
                <h1 className="text-xl font-black italic leading-tight">{video.title || 'Sans titre'}</h1>
                {fullName && (
                  <p className="text-white/50 text-sm">@{fullName}</p>
                )}

                {/* Action buttons */}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => navigate(`/video/player?id=${video.id}`)}
                    className="flex-1 py-3 text-xs font-bold uppercase tracking-widest transition"
                    style={{ background: 'linear-gradient(135deg, #2B7FFF 0%, #AD46FF 100%)', borderRadius: '24px' }}
                  >
                    Voir dans le player
                  </button>
                </div>

                {/* Tags */}
                {regularTags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {regularTags.map((tag) => (
                      <span key={tag.id} className="px-2 py-0.5 rounded-full text-[10px] bg-white/5 text-white/40 border border-white/5">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Mesures d'impact */}
            <div className="rounded-3xl border border-white/10 glass-card p-6 space-y-4">
              <h2 className="text-sm font-bold tracking-widest uppercase text-white/60">Mesures d'impact</h2>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: '—', label: 'Vues uniques' },
                  { value: '—', label: 'Applaudissements' },
                  { value: '—', label: 'Propagations' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-2xl font-black italic mars-gradient-text">{stat.value}</p>
                    <p className="text-[9px] text-white/30 tracking-wider mt-1 uppercase">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Fiche Technique */}
            <div className="rounded-3xl border border-white/10 glass-card p-6 space-y-4">
              <h2 className="text-sm font-bold tracking-widest uppercase text-white/60">Fiche Technique</h2>
              <div className="space-y-3">
                {video.country && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/40">Pays</span>
                    <span className="font-medium">{video.country}</span>
                  </div>
                )}
                {video.language && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/40">Langue</span>
                    <span className="font-medium">{video.language}</span>
                  </div>
                )}
                {video.duration && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/40">Durée</span>
                    <span className="font-medium font-mono">{formatDuration(video.duration)}</span>
                  </div>
                )}
                {video.classification && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/40">Type</span>
                    <span className="font-medium uppercase">{video.classification}</span>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* ── COLONNE DROITE — Détails ─────────────────────────────── */}
          <div className="space-y-6">

            {/* A propos / Synopsis */}
            {video.synopsis && (
              <div className="rounded-3xl border border-white/10 glass-card p-8 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold tracking-[0.3em] text-white/20 uppercase">01</span>
                  <h2 className="text-2xl font-black italic">À propos</h2>
                </div>
                <p className="text-white/60 text-sm leading-relaxed">{video.synopsis}</p>
              </div>
            )}

            {/* Manifeste du réalisateur */}
            {video.creative_resume && (
              <div className="rounded-3xl border border-white/10 glass-card p-8 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold tracking-[0.3em] text-white/20 uppercase">02</span>
                  <h2 className="text-2xl font-black italic">Manifeste du réalisateur</h2>
                </div>
                <p className="text-white/60 text-sm leading-relaxed whitespace-pre-line">{video.creative_resume}</p>
              </div>
            )}

            {/* Architecture IA */}
            {video.tech_resume && (
              <div className="rounded-3xl border border-white/10 glass-card p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold tracking-[0.3em] text-white/20 uppercase">03</span>
                  <h2 className="text-2xl font-black italic">Architecture IA</h2>
                </div>
                <p className="text-white/60 text-sm leading-relaxed whitespace-pre-line">{video.tech_resume}</p>

                {/* AI tools grid (from tags if available) */}
                {aiTools.length > 0 && (
                  <div className="grid grid-cols-3 gap-3">
                    {aiTools.map((tool, idx) => (
                      <div key={tool.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                        <p className="text-[9px] text-white/30 tracking-wider mb-1 uppercase">Moteur {idx + 1}</p>
                        <p className="font-bold text-sm">{tool.name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Réalisateur */}
            {fullName && (
              <div className="rounded-3xl border border-white/10 glass-card p-8 space-y-5">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold tracking-[0.3em] text-white/20 uppercase">04</span>
                  <h2 className="text-2xl font-black italic">Réalisateur</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-white/30 text-[10px] uppercase tracking-wider mb-1">Nom complet</p>
                    <p className="font-bold">{fullName}</p>
                  </div>
                  {video.realisator_gender && (
                    <div>
                      <p className="text-white/30 text-[10px] uppercase tracking-wider mb-1">Genre</p>
                      <p className="font-bold">{video.realisator_gender}</p>
                    </div>
                  )}
                  {video.email && (
                    <div>
                      <p className="text-white/30 text-[10px] uppercase tracking-wider mb-1">Email</p>
                      <a href={`mailto:${video.email}`} className="font-medium text-mars-blue hover:underline">
                        {video.email}
                      </a>
                    </div>
                  )}
                  {video.mobile_number && (
                    <div>
                      <p className="text-white/30 text-[10px] uppercase tracking-wider mb-1">Téléphone</p>
                      <p className="font-bold">{video.mobile_number}</p>
                    </div>
                  )}
                  {video.address && (
                    <div className="md:col-span-2">
                      <p className="text-white/30 text-[10px] uppercase tracking-wider mb-1">Adresse</p>
                      <p className="font-bold">{video.address}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Réseaux sociaux */}
            {video.social_media && video.social_media.length > 0 && (
              <div className="rounded-3xl border border-white/10 glass-card p-8 space-y-5">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold tracking-[0.3em] text-white/20 uppercase">05</span>
                  <h2 className="text-2xl font-black italic">Réseaux sociaux</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {video.social_media.map((sm) => (
                    <a
                      key={sm.id}
                      href={sm.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 transition group"
                    >
                      <span className="text-mars-blue font-bold text-sm">
                        {SOCIAL_ICONS[sm.platform] || sm.platform}
                      </span>
                      <span className="text-white/30 text-xs truncate flex-1">{sm.url}</span>
                      <svg className="w-4 h-4 text-white/20 group-hover:text-mars-blue transition shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Discussion placeholder */}
            <div className="rounded-3xl border border-white/10 glass-card p-8 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold tracking-[0.3em] text-white/20 uppercase">06</span>
                  <h2 className="text-2xl font-black italic">Discussion</h2>
                </div>
                <span className="text-xs text-white/30">— Avis</span>
              </div>

              {/* Input */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-xs font-bold">
                  U
                </div>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Écrivez votre critique..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition"
                    readOnly
                  />
                </div>
              </div>

              <p className="text-center text-white/20 text-xs py-6">Aucun commentaire pour le moment</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDetails;
