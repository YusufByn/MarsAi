import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date('2026-06-20T00:00:00');

    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 mb-16">
      <div className="flex items-center gap-3 text-xs md:text-sm font-black tracking-[0.5em] text-mars-primary uppercase">
        <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-mars-primary"></div>
        <span className="animate-pulse">Impact prévu</span>
        <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-mars-primary"></div>
      </div>
      
      <div className="flex gap-4 md:gap-8 items-center">
        <div className="flex flex-col items-center">
          <span className="text-5xl md:text-8xl font-black tracking-tighter text-white leading-none">
            {String(timeLeft.days).padStart(2, '0')}
          </span>
          <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] text-white/20 uppercase mt-2">Jours</span>
        </div>
        
        <span className="text-4xl md:text-6xl font-thin text-white/10 mb-6">:</span>
        
        <div className="flex flex-col items-center">
          <span className="text-5xl md:text-8xl font-black tracking-tighter text-white leading-none">
            {String(timeLeft.hours).padStart(2, '0')}
          </span>
          <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] text-white/20 uppercase mt-2">Heures</span>
        </div>

        <span className="text-4xl md:text-6xl font-thin text-white/10 mb-6">:</span>

        <div className="flex flex-col items-center">
          <span className="text-5xl md:text-8xl font-black tracking-tighter text-white leading-none">
            {String(timeLeft.minutes).padStart(2, '0')}
          </span>
          <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] text-white/20 uppercase mt-2">Minutes</span>
        </div>

        <span className="text-4xl md:text-6xl font-thin text-white/10 mb-6">:</span>

        <div className="flex flex-col items-center">
          <span className="text-5xl md:text-8xl font-black tracking-tighter mars-text-gradient leading-none">
            {String(timeLeft.seconds).padStart(2, '0')}
          </span>
          <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] text-white/20 uppercase mt-2">Secondes</span>
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  const navigate = useNavigate();
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
            <button className="mars-button-primary"  onClick={() => navigate('/formsubmission')}>
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
