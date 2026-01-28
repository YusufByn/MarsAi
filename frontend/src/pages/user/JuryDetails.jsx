import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { juryService } from '../../services/juryService';

const JuryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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

  if (loading) {
    return (
      <div className="min-h-screen bg-mars-dark flex items-center justify-center">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    );
  }

  if (error || !jury) {
    return (
      <div className="min-h-screen bg-mars-dark flex flex-col items-center justify-center px-6">
        <h1 className="text-4xl font-bold text-white mb-4">Jury non trouvé</h1>
        <p className="text-gray-400 mb-8">{error || 'Ce profil n\'existe pas'}</p>
        <button
          onClick={() => navigate('/')}
          className="bg-gradient-to-r from-mars-primary to-mars-secondary px-6 py-3 rounded-full text-sm font-bold tracking-widest"
        >
          RETOUR À L'ACCUEIL
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mars-dark text-white">
      
      {/* Header avec bouton retour */}
      <nav className="fixed top-0 w-full z-50 bg-mars-dark/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">FERMER</span>
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tighter">
              MARS<span className="text-mars-primary">AI</span>
            </span>
          </div>

          <div className="w-20"></div> {/* Spacer pour centrer le logo */}
        </div>
      </nav>

      {/* Hero Section - Photo de profil */}
      <header className="relative pt-32 pb-12 px-6 overflow-hidden">
        
        {/* Background glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-mars-primary/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          
          {/* Photo de profil */}
          <div className="mb-8 flex justify-center">
            {jury.illustration ? (
              <img
                src={jury.illustration}
                alt={`${jury.name} ${jury.lastname}`}
                className="w-48 h-48 rounded-full object-cover border-4 border-white/10 shadow-2xl"
              />
            ) : (
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-mars-primary to-mars-secondary flex items-center justify-center border-4 border-white/10">
                <span className="text-6xl font-bold text-white">
                  {jury.name[0]}{jury.lastname[0]}
                </span>
              </div>
            )}
          </div>

          {/* Badge JURY */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-mars-primary/30 bg-mars-primary/10 mb-6 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-mars-accent animate-pulse"></div>
            <span className="text-xs tracking-[0.2em] uppercase text-mars-primary font-bold">Membre du Jury</span>
          </div>

          {/* Nom complet */}
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4 uppercase">
            {jury.name} <span className="text-transparent bg-clip-text bg-gradient-to-r from-mars-primary to-mars-secondary">{jury.lastname}</span>
          </h1>

        </div>
      </header>

      {/* Section Biographie */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          
          <div className="bg-mars-light border border-white/10 rounded-2xl p-8 md:p-12">
            
            <div className="mb-6">
              <p className="text-mars-primary text-xs font-bold tracking-widest uppercase mb-2">Biographie</p>
              <div className="h-1 w-16 bg-gradient-to-r from-mars-primary to-mars-secondary rounded-full"></div>
            </div>

            {jury.biographie ? (
              <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-line">
                {jury.biographie}
              </p>
            ) : (
              <p className="text-gray-500 italic">Aucune biographie disponible pour le moment.</p>
            )}

            {/* Date de création (optionnelle) */}
            {jury.created_at && (
              <div className="mt-8 pt-8 border-t border-white/5">
                <p className="text-xs text-gray-500 uppercase tracking-widest">
                  Membre depuis {new Date(jury.created_at).toLocaleDateString('fr-FR', { 
                    year: 'numeric', 
                    month: 'long' 
                  })}
                </p>
              </div>
            )}

          </div>

        </div>
      </section>

    </div>
  );
};

export default JuryDetails;
