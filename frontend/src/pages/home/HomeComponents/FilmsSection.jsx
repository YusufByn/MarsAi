import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function FilmsSection() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className="relative px-6 py-20 md:py-32 overflow-hidden">
      {/* Glows de fond */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-mars-primary/8 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-mars-secondary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Texte */}
          <div className="space-y-6">
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-mars-primary/70">
              {t('home.films.kicker')}
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-none">
              {t('home.films.title1')}
              <br />
              <span className="mars-text-gradient">{t('home.films.title2')}</span>
            </h2>
            <p className="text-white/50 text-base md:text-lg leading-relaxed max-w-md">
              {t('home.films.description')}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => navigate('/videos')}
                className="mars-button-primary"
              >
                {t('home.films.viewAll')}
              </button>
              <button
                onClick={() => navigate('/video/player')}
                className="mars-button-outline"
              >
                {t('home.films.launchPlayer')}
              </button>
            </div>
          </div>

          {/* Visual */}
          <div className="relative hidden lg:block">
            {/* Grille decorative de "film cards" */}
            <div className="grid grid-cols-3 gap-3 opacity-60">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className={`rounded-xl bg-white/5 border border-white/10 aspect-[3/4] ${
                    i === 4 ? 'scale-110 opacity-100 border-mars-primary/30 bg-mars-primary/10' : ''
                  }`}
                  style={{
                    transform: i === 4 ? 'scale(1.1)' : `rotate(${(i % 3 - 1) * 1.5}deg)`,
                    transition: 'all 0.3s',
                  }}
                >
                  {i === 4 && (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-3">
                      <div className="w-10 h-10 rounded-full bg-mars-primary/30 flex items-center justify-center">
                        <svg className="w-5 h-5 text-mars-primary" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                      <div className="h-1.5 w-3/4 rounded-full bg-white/10" />
                      <div className="h-1.5 w-1/2 rounded-full bg-white/10" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Badge flottant */}
            <div className="absolute -top-4 -right-4 px-4 py-2 rounded-full bg-mars-primary/20 border border-mars-primary/30 backdrop-blur-sm">
              <span className="text-xs font-bold text-mars-primary tracking-wider">MARS.AI 2025</span>
            </div>

            {/* Compteur films */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full bg-black/60 border border-white/10 backdrop-blur-sm">
              <span className="text-xs text-white/50 tracking-widest uppercase">{t('home.films.inSelection')}</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
