import React, { useState, useEffect } from 'react';

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCountdown = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cms/countdown`);
        const data = await response.json();
        
        if (data.success && data.countdown && !data.expired) {
          setTimeLeft(data);
        } else {
          setTimeLeft(null);
        }
      } catch (error) {
        console.error('Error fetching countdown:', error);
        setTimeLeft(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCountdown();
    
    // Mettre à jour toutes les secondes
    const interval = setInterval(fetchCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  // Ne rien afficher si pas de countdown ou en chargement
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
            {String(timeLeft?.days || 0).padStart(2, '0')}
          </span>
          <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] text-white/20 uppercase mt-2">Jours</span>
        </div>
        
        <span className="text-4xl md:text-6xl font-thin text-white/10 mb-6">:</span>
        
        <div className="flex flex-col items-center">
          <span className="text-5xl md:text-8xl font-black tracking-tighter text-white leading-none">
            {String(timeLeft?.hours || 0).padStart(2, '0')}
          </span>
          <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] text-white/20 uppercase mt-2">Heures</span>
        </div>

        <span className="text-4xl md:text-6xl font-thin text-white/10 mb-6">:</span>

        <div className="flex flex-col items-center">
          <span className="text-5xl md:text-8xl font-black tracking-tighter text-white leading-none">
            {String(timeLeft?.minutes || 0).padStart(2, '0')}
          </span>
          <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] text-white/20 uppercase mt-2">Minutes</span>
        </div>

        <span className="text-4xl md:text-6xl font-thin text-white/10 mb-6">:</span>

        <div className="flex flex-col items-center">
          <span className="text-5xl md:text-8xl font-black tracking-tighter mars-text-gradient leading-none">
            {String(timeLeft?.seconds || 0).padStart(2, '0')}
          </span>
          <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] text-white/20 uppercase mt-2">Secondes</span>
        </div>
      </div>
    </div>
  );
};

export default Countdown;
