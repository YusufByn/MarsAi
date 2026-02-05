import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { juryService } from '../../services/juryService';

const JuryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [jury, setJury] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJury = async () => {
      try {
        setLoading(true);
        const response = await juryService.getById(id);
        setJury(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJury();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white font-light tracking-[0.3em] animate-pulse uppercase">{t('juryDetails.loading')}</div>
    </div>
  );

  if (error || !jury) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-6">{t('juryDetails.profileLost')}</h1>
      <button onClick={() => navigate('/jury')} className="mars-button-outline">{t('juryDetails.backToJury')}</button>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center p-6 lg:p-12 overflow-hidden">

      {/* 1. BACKGROUND IMMERSIF (Photo floutée) */}
      <div className="absolute inset-0 z-0">
        <img
          src={jury.illustration}
          className="w-full h-full object-cover scale-110 blur-[120px] opacity-30"
          alt="blur background"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-90"></div>
      </div>

      {/* 2. BOUTON RETOUR (Positionné par rapport au contenu) */}
      <button
        onClick={() => navigate('/jury')}
        className="fixed top-32 left-8 lg:left-12 z-[110] glass-card w-14 h-14 rounded-full flex items-center justify-center hover:bg-white/10 transition-all hover:scale-110 group border-white/20"
      >
        <svg className="w-6 h-6 text-white/40 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* 3. LA "FENÊTRE" PRINCIPALE (Style Music Player Window) */}
      <div className="relative z-10 w-full max-w-2xl aspect-[3/4.5] md:aspect-[3/4] lg:aspect-[3/4.2] rounded-[4rem] overflow-hidden shadow-[0_80px_150px_-30px_rgba(0,0,0,1)] border border-white/10 group">

        {/* Photo Nette */}
        <img
          src={jury.illustration}
          alt={`${jury.name} ${jury.lastname}`}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
        />

        {/* Overlays de Design */}
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/95"></div>

        {/* TITRE (Style Folded / Kehlani) */}
        <div className="absolute top-16 left-12 right-12">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-[0.8] italic uppercase mb-4 transition-transform duration-700">
            {jury.lastname}
          </h1>
          <p className="text-2xl md:text-3xl font-medium text-white/40 tracking-tight">
            {jury.name}
          </p>
        </div>

        {/* SECTION BIOGRAPHIE (Panneau de Verre Flottant) */}
        <div className="absolute bottom-10 left-8 right-8 md:bottom-12 md:left-12 md:right-12">
          <div className="glass-card rounded-[3rem] p-8 md:p-12 border-white/20 shadow-2xl backdrop-blur-3xl bg-white/5">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-2 rounded-full bg-mars-primary animate-pulse shadow-[0_0_10px_rgba(139,92,246,0.8)]"></div>
              <span className="text-[10px] font-bold tracking-[0.4em] text-white/30 uppercase">{t('juryDetails.manifesto')}</span>
            </div>

            <div className="max-h-40 md:max-h-56 overflow-y-auto pr-4 custom-scrollbar">
              <p className="text-lg md:text-xl text-white/90 leading-relaxed font-light italic">
                "{jury.biographie}"
              </p>
            </div>

            {/* Action Bar (Style Controls) */}
            <div className="mt-10 pt-10 border-t border-white/5 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold tracking-[0.3em] text-mars-primary uppercase mb-1 font-black">{t('juryDetails.ceremony')}</span>
                <span className="text-xs text-white/40 font-medium">{t('juryDetails.grandJury')}</span>
              </div>
              <div className="flex gap-4">
                <a href="#" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/30 cursor-pointer transition-all">
                  <svg className="w-5 h-5 text-white/60" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
                <a href="#" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/30 cursor-pointer transition-all">
                   <svg className="w-5 h-5 text-white/60" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default JuryDetails;
