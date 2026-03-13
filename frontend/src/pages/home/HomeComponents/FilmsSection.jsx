import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { videoService } from '../../../services/videoService';
import { API_URL } from '../../../config';

const getCoverUrl = (video) => {
  const src = video.cover_url || (video.cover ? `/uploads/covers/${video.cover}` : null);
  if (!src) return null;
  if (src.startsWith('http')) return src;
  return `${API_URL}${src}`;
};

export default function FilmsSection() {
  const { t } = useTranslation();
  const [films, setFilms] = useState([]);

  useEffect(() => {
    videoService.getAll({ limit: 4 })
      .then((res) => setFilms(res.data ?? []))
      .catch((err) => console.error('[FILMS] Erreur chargement:', err));
  }, []);

  return (
    <section className="relative px-6 py-10 md:py-16 overflow-hidden">
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[900px] h-[500px] bg-mars-primary/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-mars-primary/70">
            {t('home.films.kicker')}
          </p>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mt-3">
            {t('home.films.title1')}{' '}
            <span className="mars-text-gradient">{t('home.films.title2')}</span>
          </h2>
        </div>

        {/* 4 cards portrait */}
        {films.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-10">
            {films.map((video) => {
              const coverUrl   = getCoverUrl(video);
              const authorName = video.author || [video.realisator_name, video.realisator_lastname].filter(Boolean).join(' ');

              return (
                <Link
                  key={video.id}
                  to={`/videoDetails/${video.id}`}
                  className="relative rounded-xl overflow-hidden group aspect-[2/3] border border-white/10 hover:border-white/30 transition-all hover:scale-[1.02]"
                >
                  {/* Cover */}
                  {coverUrl ? (
                    <img
                      src={coverUrl}
                      alt={video.title}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black flex items-center justify-center">
                      <svg className="w-8 h-8 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                  {/* Badge classification */}
                  <div className="absolute top-2 left-2">
                    <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold backdrop-blur-sm ${
                      video.classification === 'ia'
                        ? 'bg-purple-500/30 text-purple-200 border border-purple-400/30'
                        : 'bg-orange-500/30 text-orange-200 border border-orange-400/30'
                    }`}>
                      {video.classification?.toUpperCase() || 'N/A'}
                    </span>
                  </div>

                  {/* Infos bas */}
                  <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-3">
                    <h3 className="font-black text-xs text-white leading-tight line-clamp-2">
                      {video.title || 'Sans titre'}
                    </h3>
                    {authorName && (
                      <p className="text-white/50 text-[10px] mt-0.5 truncate">{authorName}</p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/videos" className="mars-button-primary">
            {t('home.films.viewAll')}
          </Link>
          <Link to="/video/player" className="mars-button-outline">
            {t('home.films.launchPlayer')}
          </Link>
        </div>
      </div>
    </section>
  );
}
