import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { juryService } from '../../services/juryService';

const AllJury = () => {
  const navigate = useNavigate();
  const [jurys, setJurys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllJurys = async () => {
      try {
        setLoading(true);
        const response = await juryService.getAll();
        setJurys(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllJurys();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white font-light tracking-[0.3em] animate-pulse uppercase">Initialisation du Jury...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6">
        <h1 className="text-4xl font-black text-white mb-4 italic tracking-tighter">ERREUR</h1>
        <p className="text-white/40 mb-8 font-light">{error}</p>
        <button
          onClick={() => navigate('/')}
          className="mars-button-outline"
        >
          RETOUR À L'ACCUEIL
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20">
      
      {/* Background Glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-mars-primary/10 blur-[150px] rounded-full pointer-events-none z-0"></div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-6">
        
        {/* Header Section */}
        <header className="mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 mb-6 backdrop-blur-md">
            <div className="w-1.5 h-1.5 rounded-full bg-mars-primary animate-pulse"></div>
            <span className="text-[10px] tracking-[0.3em] uppercase text-white/60 font-bold">Édition Festival 2026</span>
          </div>

          <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-4 italic uppercase leading-[0.8]">
            LES <span className="mars-text-gradient">JURYS</span>
          </h1>
          <p className="text-xl text-white/40 font-light max-w-2xl leading-relaxed">
            Rencontrez les visionnaires du septième art qui sélectionneront les chefs-d'œuvre de la narration générative de cette année.
          </p>
        </header>

        {/* Grid des Jurys Style Music Player */}
        {jurys.length === 0 ? (
          <div className="text-center py-40 glass-card rounded-[3rem]">
            <p className="text-white/20 text-xl font-light tracking-widest uppercase">Aucun jury n'a encore rejoint l'aventure.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10">
            {jurys.map((jury) => (
              <div
                key={jury.id}
                onClick={() => navigate(`/jury/profil/${jury.id}`)}
                className="group relative aspect-[3/4] rounded-[3rem] overflow-hidden cursor-pointer transition-all duration-700 hover:scale-[1.02] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] border border-white/5"
              >
                {/* Image de fond avec zoom au hover */}
                {jury.illustration ? (
                  <img
                    src={jury.illustration}
                    alt={`${jury.name} ${jury.lastname}`}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 bg-mars-gray flex items-center justify-center">
                    <span className="text-8xl font-black text-white/5 uppercase italic opacity-20">
                      {jury.name[0]}{jury.lastname[0]}
                    </span>
                  </div>
                )}

                {/* Overlays de Design */}
                <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] group-hover:backdrop-blur-none transition-all duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90"></div>

                {/* Infos en haut (Style Folded/Kehlani) */}
                <div className="absolute top-10 left-10 right-10">
                  <h3 className="text-4xl font-black tracking-tighter text-white leading-[0.8] mb-2 uppercase italic transition-transform duration-500 group-hover:-translate-y-1">
                    {jury.lastname}
                  </h3>
                  <p className="text-xl font-medium text-white/60 tracking-tight transition-transform duration-500 group-hover:-translate-y-1 delay-75">
                    {jury.name}
                  </p>
                </div>

                {/* Badge flottant en bas (Style Playback controls) */}
                <div className="absolute bottom-10 left-10 right-10">
                  <div className="glass-card py-5 px-8 rounded-3xl flex items-center justify-between border-white/20 backdrop-blur-2xl transition-all duration-500 group-hover:bg-white/10">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold tracking-[0.3em] text-mars-primary uppercase mb-1">Cérémonie 2026</span>
                      <span className="text-xs font-medium text-white/80">Jury International</span>
                    </div>
                    <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center bg-white/5 group-hover:bg-mars-primary group-hover:border-transparent transition-all duration-500">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Effet de brillance au hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default AllJury;
