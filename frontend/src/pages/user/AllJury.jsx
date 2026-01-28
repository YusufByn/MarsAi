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
      <div className="min-h-screen bg-mars-dark flex items-center justify-center">
        <div className="text-white text-xl">Chargement des jurys...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-mars-dark flex flex-col items-center justify-center px-6">
        <h1 className="text-4xl font-bold text-white mb-4">Erreur</h1>
        <p className="text-gray-400 mb-8">{error}</p>
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
      
      {/* Header */}
      <nav className="fixed top-0 w-full z-50 bg-mars-dark/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">RETOUR</span>
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tighter">
              MARS<span className="text-mars-primary">AI</span>
            </span>
          </div>

          <div className="w-20"></div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 pb-16 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-mars-primary/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-mars-primary/30 bg-mars-primary/10 mb-6 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-mars-accent animate-pulse"></div>
            <span className="text-xs tracking-[0.2em] uppercase text-mars-primary font-bold">Festival MarsAI 2026</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4 uppercase">
            Membres du <span className="text-transparent bg-clip-text bg-gradient-to-r from-mars-primary to-mars-secondary">Jury</span>
          </h1>

          <p className="text-xl text-gray-400 font-light mb-8">
            {jurys.length} {jurys.length > 1 ? 'personnalités' : 'personnalité'} du cinéma qui vont élire les films finaux
          </p>
        </div>
      </header>

      {/* Grid des Jurys */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          
          {jurys.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">Aucun jury n'a été ajouté pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {jurys.map((jury) => (
                <div
                  key={jury.id}
                  onClick={() => navigate(`/jury/profil/${jury.id}`)}
                  className="group bg-mars-light border border-white/10 rounded-2xl overflow-hidden hover:border-mars-primary/50 transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
                >
                  {/* Image de profil */}
                  <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-mars-primary/20 to-mars-secondary/20">
                    {jury.illustration ? (
                      <img
                        src={jury.illustration}
                        alt={`${jury.name} ${jury.lastname}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-8xl font-bold text-white/50">
                          {jury.name[0]}{jury.lastname[0]}
                        </span>
                      </div>
                    )}
                    
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-mars-dark via-transparent to-transparent opacity-60"></div>
                    
                    {/* Badge Jury */}
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full border border-mars-primary/30 bg-mars-primary/20 backdrop-blur-sm">
                      <span className="text-[10px] tracking-[0.2em] uppercase text-mars-primary font-bold">Jury</span>
                    </div>
                  </div>

                  {/* Infos */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-mars-primary transition-colors">
                      {jury.name} <span className="text-transparent bg-clip-text bg-gradient-to-r from-mars-primary to-mars-secondary">{jury.lastname}</span>
                    </h3>
                    
                    {jury.biographie && (
                      <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed mb-4">
                        {jury.biographie}
                      </p>
                    )}

                    {/* Bouton Voir le profil */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <span className="text-xs text-gray-500 uppercase tracking-widest">
                        {new Date(jury.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}
                      </span>
                      <div className="flex items-center gap-2 text-mars-primary text-sm font-bold group-hover:gap-3 transition-all">
                        <span>Voir le profil</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* Footer CTA */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-mars-primary/10 to-mars-secondary/10 border border-mars-primary/20 rounded-3xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Rejoignez l'aventure MarsAI
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Soumettez votre court-métrage généré par IA et tentez de remporter l'un des prix du festival.
          </p>
          <button className="bg-gradient-to-r from-mars-primary to-mars-secondary px-8 py-4 rounded-full text-sm font-bold tracking-widest hover:opacity-90 transition-opacity">
            SOUMETTRE MON FILM
          </button>
        </div>
      </section>

    </div>
  );
};

export default AllJury;
