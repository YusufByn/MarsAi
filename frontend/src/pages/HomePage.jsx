import React from 'react';
import Countdown from '../components/Countdown';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-mars-primary selection:text-white overflow-x-hidden">
      
      {/* --- HERO SECTION --- */}
      <header className="relative pt-48 pb-20 md:pt-64 md:pb-32 px-6 flex flex-col items-center justify-center text-center overflow-hidden">
        
        {/* Background Glow Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[700px] bg-mars-primary/10 blur-[150px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 mb-8 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-mars-accent animate-pulse"></div>
            <span className="text-[10px] tracking-[0.3em] uppercase text-white/60 font-bold">Protocole d'immersion 2026</span>
          </div>
          
          <h1 className="text-8xl md:text-[12rem] font-black tracking-tighter mb-4 leading-[0.8] italic uppercase">
            MARS<span className="mars-text-gradient">AI</span>
          </h1>
          <Countdown />
          <p className="text-xl md:text-2xl text-white/40 font-light mb-16 tracking-wide max-w-2xl">
            L'apogée du cinéma génératif. Repoussez les limites de la narration numérique.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-12">
            <button className="mars-button-primary">
              SOUMETTRE MON FILM
            </button>
            
            <button className="mars-button-outline">
              DÉCOUVRIR LE JURY
            </button>
          </div>
        </div>
        
        <div className="absolute bottom-12 animate-bounce text-white/20">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </header>

    </div>
  );
};

export default HomePage;
