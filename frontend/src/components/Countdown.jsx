import React, { useState, useEffect, useRef } from 'react';

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [phaseDate, setPhaseDate] = useState(null);
  const hasFetched = useRef(false);

  // Fetch unique au chargement : récupère la date de phase une seule fois
  useEffect(() => {
    // Protection contre les appels multiples
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchHomepage = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/homepage`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.countdown?.phaseDate) {
          setPhaseDate(new Date(data.countdown.phaseDate));
        } else {
          setPhaseDate(null);
        }
      } catch (error) {
        console.error('Error fetching homepage:', error);
        setPhaseDate(null);
      } finally {
        setLoading(false);
      }
    };

    fetchHomepage();
  }, []);

  // Calcul automatique du countdown côté client : mise à jour toutes les secondes sans requête API
  useEffect(() => {
    if (!phaseDate) {
      setTimeLeft(null);
      return;
    }

    const calculateTimeLeft = () => {
      const now = new Date();
      const diff = phaseDate - now;
      
      if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
      }

      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
        expired: false
      };
    };

    // Calcul initial
    setTimeLeft(calculateTimeLeft());
    
    // Mise à jour automatique toutes les secondes (sans nouvelle requête API)
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Nettoyage de l'intervalle au démontage du composant
    return () => clearInterval(interval);
  }, [phaseDate]);

  if (loading || !timeLeft) {
    return null;
  }

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
            {String(timeLeft.days || 0).padStart(2, '0')}
          </span>
          <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] text-white/20 uppercase mt-2">Jours</span>
        </div>
        
        <span className="text-4xl md:text-6xl font-thin text-white/10 mb-6">:</span>
        
        <div className="flex flex-col items-center">
          <span className="text-5xl md:text-8xl font-black tracking-tighter text-white leading-none">
            {String(timeLeft.hours || 0).padStart(2, '0')}
          </span>
          <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] text-white/20 uppercase mt-2">Heures</span>
        </div>

        <span className="text-4xl md:text-6xl font-thin text-white/10 mb-6">:</span>

        <div className="flex flex-col items-center">
          <span className="text-5xl md:text-8xl font-black tracking-tighter text-white leading-none">
            {String(timeLeft.minutes || 0).padStart(2, '0')}
          </span>
          <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] text-white/20 uppercase mt-2">Minutes</span>
        </div>

        <span className="text-4xl md:text-6xl font-thin text-white/10 mb-6">:</span>

        <div className="flex flex-col items-center">
          <span className="text-5xl md:text-8xl font-black tracking-tighter mars-text-gradient leading-none">
            {String(timeLeft.seconds || 0).padStart(2, '0')}
          </span>
          <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] text-white/20 uppercase mt-2">Secondes</span>
        </div>
      </div>
    </div>
  );
};

export default Countdown;
