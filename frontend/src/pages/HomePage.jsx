import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Countdown from '../components/Countdown';

const PROGRAMME = {
  'Jour 01': [
    { type: 'WORKSHOP', time: '10:30', title: 'Masterclass Sora', subtitle: 'Signal Stable • Immersion Niveau 1' },
    { type: 'LIVE', time: '15:00', title: 'Démos Prompt Engineering', subtitle: 'Signal Stable • Immersion Niveau 1' },
    { type: 'EXPO', time: '18:00', title: 'Galerie des Émotions', subtitle: 'Signal Stable • Immersion Niveau 1' },
    { type: 'PARTY', time: '21:30', title: 'Concert Suno AI', subtitle: 'Signal Stable • Immersion Niveau 1' },
  ],
  'Jour 02': [
    { type: 'WORKSHOP', time: '09:00', title: 'Atelier Diffusion Stable', subtitle: 'Signal Stable • Immersion Niveau 2' },
    { type: 'LIVE', time: '14:00', title: 'Table Ronde : IA & Éthique', subtitle: 'Signal Stable • Immersion Niveau 2' },
    { type: 'EXPO', time: '17:30', title: 'Panorama des Finalistes', subtitle: 'Signal Stable • Immersion Niveau 2' },
    { type: 'PARTY', time: '22:00', title: 'Soirée Générative', subtitle: 'Signal Stable • Immersion Niveau 2' },
  ],
  'Jour 03': [
    { type: 'WORKSHOP', time: '10:00', title: 'Hackathon Cinéma IA', subtitle: 'Signal Stable • Immersion Niveau 3' },
    { type: 'LIVE', time: '16:00', title: 'Cérémonie des Prix', subtitle: 'Signal Stable • Immersion Niveau 3' },
    { type: 'EXPO', time: '19:00', title: 'Exposition Permanente', subtitle: 'Signal Stable • Immersion Niveau 3' },
    { type: 'PARTY', time: '21:00', title: 'Clôture du Festival', subtitle: 'Signal Stable • Immersion Niveau 3' },
  ],
};

const TYPE_COLORS = {
  WORKSHOP: 'bg-mars-blue/10 text-mars-blue border-mars-blue/20',
  LIVE: 'bg-red-500/10 text-red-400 border-red-500/20',
  EXPO: 'bg-mars-purple/10 text-mars-purple border-mars-purple/20',
  PARTY: 'bg-mars-pink/10 text-mars-pink border-mars-pink/20',
};

const JURY = [
  { initials: 'SS', name: 'S. Spielberg', role: 'Cinéaste Légendaire' },
  { initials: 'GD', name: 'G. Del Toro', role: 'Maître de l\'Imaginaire' },
  { initials: 'EV', name: 'Elena Vance', role: 'Chercheuse IA Art' },
  { initials: 'MT', name: 'Marc Thorne', role: 'Directeur de Mission' },
];

const PRIZES = [
  { rank: '01', title: 'Grand Prix du Jury', amount: '$100,000' },
  { rank: '02', title: 'Meilleur Scénario IA', amount: '$50,000' },
  { rank: '03', title: 'Innovation Technique', amount: '$25,000' },
];

const TICKER_ITEMS = [
  'MARSAI 2026', 'FESTIVAL DU CINÉMA GÉNÉRATIF', 'MARSEILLE',
  '20—22 JUIN', 'VIEUX-PORT', '600 FILMS', '120 PAYS',
  'INTELLIGENCE ARTIFICIELLE', 'HYBRIDATION', 'FUTURS POSSIBLES',
];

const HomePage = () => {
  const navigate = useNavigate();
  const [activeDay, setActiveDay] = useState('Jour 01');

  return (
    <div className="isolate min-h-screen bg-black text-white font-sans overflow-x-hidden">

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 pb-16">

        {/* Blobs */}
        <div className="absolute top-1/4 left-1/4 w-[300px] sm:w-[500px] lg:w-[700px] h-[300px] sm:h-[500px] lg:h-[700px] bg-mars-blue/5 blur-[120px] sm:blur-[160px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[200px] sm:w-[400px] lg:w-[600px] h-[200px] sm:h-[400px] lg:h-[600px] bg-mars-pink/5 blur-[120px] sm:blur-[160px] rounded-full pointer-events-none" />

        {/* Badge */}
        <div className="relative z-10 mb-6 sm:mb-10">
          <div className="inline-flex items-center gap-2 sm:gap-2.5 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-mars-blue animate-pulse" />
            <span className="text-[9px] sm:text-[10px] tracking-[0.3em] sm:tracking-[0.35em] uppercase text-white/50 font-bold">
              Protocol d'Immersion 2026
            </span>
          </div>
        </div>

        {/* Logo marsAI */}
        <div className="relative z-10 text-center mb-6 sm:mb-10 w-full">
          <h1
            className="font-black tracking-[-0.04em] leading-[0.85] italic uppercase select-none"
            style={{ fontSize: 'clamp(4rem, 18vw, 18rem)' }}
          >
            <span className="text-white">mars</span>
            <span className="mars-gradient-text" style={{ display: 'inline-block', paddingRight: '0.06em' }}>AI</span>
          </h1>
          <p className="text-base sm:text-xl md:text-2xl text-white/40 font-light mt-3 sm:mt-4 tracking-[-0.02em] px-4">
            L'apogée du cinéma génératif.
          </p>
        </div>

        {/* Countdown */}
        <div className="relative z-10 w-full mt-6 sm:mt-10">
          <Countdown />
        </div>

        {/* CTAs */}
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={() => navigate('/formsubmission')}
            className="mars-button-primary flex items-center gap-2.5"
          >
            <span>Soumettre mon film</span>
            <span className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center bg-white/10 shrink-0">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </button>

          <button onClick={() => navigate('/jury')} className="mars-button-outline">
            Découvrir le jury
          </button>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/20">
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ── TICKER ────────────────────────────────────────────────────── */}
      <div className="border-y border-white/5 py-3 overflow-hidden bg-white/[0.02]">
        <div className="flex whitespace-nowrap" style={{ animation: 'ticker 30s linear infinite' }}>
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-4 sm:gap-6 px-4 sm:px-6 text-[9px] sm:text-[10px] font-bold tracking-[0.25em] sm:tracking-[0.3em] uppercase text-white/20">
              {item}
              <span className="w-1 h-1 rounded-full bg-mars-blue/40 shrink-0" />
            </span>
          ))}
        </div>
      </div>

      {/* ── STATS ─────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-white/5">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
          {[
            { value: '600', label: 'Films En Compétition' },
            { value: '120', label: 'Pays Représentés' },
            { value: '50', label: 'Jours d\'Immersion' },
            { value: '50', label: 'Conférenciers' },
          ].map((stat) => (
            <div key={stat.label} className="text-center group">
              <p
                className="font-black italic tracking-tighter mars-gradient-text mb-1 sm:mb-2 transition-transform duration-300 group-hover:scale-105"
                style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)' }}
              >
                {stat.value}
              </p>
              <p className="text-[10px] sm:text-xs text-white/40 tracking-[0.15em] sm:tracking-[0.2em] uppercase leading-snug">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── MANIFESTE ─────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 sm:mb-16">
            <p className="mars-section-label mb-3 sm:mb-4">Manifeste</p>
            <h2
              className="font-black italic tracking-tighter uppercase leading-[0.85]"
              style={{ fontSize: 'clamp(2.5rem, 8vw, 5.5rem)' }}
            >
              L'art de la contrainte
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                title: 'HYBRIDATION',
                text: 'L\'IA n\'est pas un outil, c\'est un collaborateur. Nous explorons la frontière entre l\'humain et la machine pour créer des œuvres inédites.',
                num: '01',
              },
              {
                title: 'FUTURS POSSIBLES',
                text: 'Chaque film est une fenêtre ouverte sur demain. Nous célébrons la vision, l\'audace et les nouvelles formes narratives que l\'IA rend possibles.',
                num: '02',
              },
              {
                title: 'DÉMOCRATIE',
                text: 'L\'accès à la création sans frontières. N\'importe qui, n\'importe où, peut désormais raconter une histoire universelle avec les outils génératifs.',
                num: '03',
              },
            ].map((item) => (
              <div key={item.title} className="glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-3 sm:space-y-4 group hover:bg-white/[0.07] transition-colors duration-300">
                <span className="text-[10px] tracking-[0.3em] text-white/20 font-bold">{item.num}</span>
                <h3 className="text-base sm:text-xl font-black tracking-wider uppercase">{item.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROGRAMME ─────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10 sm:mb-12">
            <p className="mars-section-label mb-3 sm:mb-4">Marseille, Hub Créatif</p>
            <h2
              className="font-black italic tracking-tighter uppercase leading-[0.85]"
              style={{ fontSize: 'clamp(2.5rem, 8vw, 5.5rem)' }}
            >
              Le Protocole Temporel
            </h2>
          </div>

          {/* Day tabs */}
          <div className="flex gap-2 mb-6 sm:mb-10 overflow-x-auto scrollbar-hide pb-1">
            {Object.keys(PROGRAMME).map((day) => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                  activeDay === day
                    ? 'bg-white text-black'
                    : 'border border-white/10 text-white/50 hover:border-white/30 hover:text-white'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Events */}
          <div className="space-y-2 sm:space-y-3">
            {PROGRAMME[activeDay].map((event, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 sm:gap-5 glass-card rounded-xl sm:rounded-2xl px-3 sm:px-6 py-3 sm:py-5 group hover:bg-white/[0.07] transition-colors"
              >
                <span className={`px-2 py-1 rounded-md sm:rounded-lg text-[9px] sm:text-[10px] font-bold border tracking-wider sm:tracking-widest whitespace-nowrap shrink-0 ${TYPE_COLORS[event.type]}`}>
                  {event.type}
                </span>
                <span className="text-white/30 text-xs sm:text-sm font-mono w-10 sm:w-12 shrink-0">{event.time}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-xs sm:text-sm truncate">{event.title}</p>
                  <p className="text-[10px] sm:text-[11px] text-white/30 mt-0.5 hidden sm:block">{event.subtitle}</p>
                </div>
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/20 group-hover:text-white/50 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── JURY ──────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 sm:mb-16 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="mars-section-label mb-3 sm:mb-4">Les Sentinelles</p>
              <h2
                className="font-black italic tracking-tighter uppercase leading-[0.85]"
                style={{ fontSize: 'clamp(2.5rem, 8vw, 5.5rem)' }}
              >
                Le Jury International
              </h2>
            </div>
            <button
              onClick={() => navigate('/jury')}
              className="self-start sm:self-auto px-5 py-2.5 rounded-full border border-white/10 text-sm font-bold text-white/50 hover:border-white/30 hover:text-white transition whitespace-nowrap"
            >
              Voir tous →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {JURY.map((member) => (
              <div
                key={member.name}
                onClick={() => navigate('/jury')}
                className="group relative overflow-hidden cursor-pointer border border-white/5 hover:border-white/20 transition-all hover:scale-[1.02] duration-500"
                style={{ borderRadius: '24px', aspectRatio: '3/4' }}
              >
                {/* Gradient bg */}
                <div className="absolute inset-0 bg-gradient-to-br from-mars-blue/10 via-mars-purple/5 to-mars-pink/10 group-hover:from-mars-blue/15 group-hover:to-mars-pink/15 transition-all duration-500" />

                {/* Initials */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl sm:text-6xl font-black italic text-white/5">{member.initials}</span>
                </div>

                {/* Bottom info */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 sm:p-5">
                  <p className="font-black text-base sm:text-lg italic leading-tight">{member.name}</p>
                  <p className="text-[10px] sm:text-xs text-white/40 mt-1">{member.role}</p>
                </div>

                {/* Hover arrow */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/10 flex items-center justify-center bg-white/5 opacity-0 group-hover:opacity-100 group-hover:bg-white/20 transition-all duration-300">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRIX ──────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10 sm:mb-16">
            <p className="mars-section-label mb-3 sm:mb-4">Distinctions</p>
            <h2
              className="font-black italic tracking-tighter uppercase leading-[0.85]"
              style={{ fontSize: 'clamp(2.5rem, 8vw, 5.5rem)' }}
            >
              Gains &amp; Prix
            </h2>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {PRIZES.map((prize, index) => (
              <div
                key={prize.rank}
                className="glass-card rounded-xl sm:rounded-2xl px-5 sm:px-8 py-4 sm:py-6 group hover:bg-white/[0.08] transition-colors"
              >
                <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-2 justify-between">
                  <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                    <span className="text-[10px] font-bold tracking-[0.3em] text-white/20 shrink-0">{prize.rank}</span>
                    <h3 className="text-sm sm:text-lg font-bold truncate">{prize.title}</h3>
                  </div>
                  <span
                    className="font-black italic mars-gradient-text shrink-0"
                    style={{ fontSize: index === 0 ? 'clamp(1.25rem, 4vw, 1.875rem)' : 'clamp(1.1rem, 3.5vw, 1.5rem)' }}
                  >
                    {prize.amount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LOCALISATION ──────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 sm:mb-16">
            <p className="mars-section-label mb-3 sm:mb-4">Espace-Temps</p>
            <h2
              className="font-black italic tracking-tighter uppercase leading-[0.85]"
              style={{ fontSize: 'clamp(2rem, 7vw, 5.5rem)' }}
            >
              Localisation du Festival
            </h2>
          </div>

          <div className="glass-card rounded-2xl sm:rounded-3xl overflow-hidden">
            {/* Map placeholder */}
            <div
              className="relative bg-gradient-to-br from-mars-blue/5 to-mars-purple/5 flex items-center justify-center border-b border-white/5"
              style={{ height: 'clamp(10rem, 30vw, 20rem)' }}
            >
              {/* Grid overlay */}
              <div className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }}
              />
              <div className="relative text-center space-y-2 sm:space-y-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-full bg-white/10 flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p className="text-white/40 text-xs sm:text-sm">Vieux-Port, Marseille</p>
              </div>
            </div>

            <div className="p-5 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
              <div>
                <p className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-white/30 mb-1">Adresse</p>
                <p className="font-bold text-base sm:text-lg">J4 • Vieux-Port, Marseille</p>
                <p className="text-white/40 text-xs sm:text-sm mt-1">20 – 22 Juin 2026</p>
              </div>
              <button onClick={() => navigate('/formsubmission')} className="mars-button-primary w-full sm:w-auto text-center">
                Réserver ma place
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Ticker keyframe */}
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
