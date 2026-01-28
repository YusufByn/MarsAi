import React from 'react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-mars-dark text-white font-sans selection:bg-mars-primary selection:text-white overflow-x-hidden">
      
      {/* --- HEADER --- */}
      <nav className="fixed top-0 w-full z-50 bg-mars-dark/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tighter">MARS<span className="text-mars-primary">AI</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <a href="#" className="hover:text-white transition-colors">PROGRAMME</a>
            <a href="#" className="hover:text-white transition-colors">FILMS</a>
            <a href="#" className="hover:text-white transition-colors">JURY</a>
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden md:block text-xs font-bold tracking-widest hover:text-mars-primary transition-colors">CONNEXION</button>
            <button className="bg-gradient-to-r from-mars-primary to-mars-secondary px-6 py-2 rounded-full text-xs font-bold tracking-widest hover:opacity-90 transition-opacity">
              INSCRIPTION
            </button>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 flex flex-col items-center justify-center text-center overflow-hidden">
        
        {/* Background Glow Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-mars-primary/20 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-8 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-mars-accent animate-pulse"></div>
            <span className="text-[10px] tracking-[0.2em] uppercase text-gray-300">Protocole d'immersion 2026</span>
          </div>
          
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-6 leading-none">
            MARS<span className="text-transparent bg-clip-text bg-gradient-to-r from-mars-primary to-mars-secondary">AI</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 font-light mb-12 tracking-wide">
            L'apogée du cinéma génératif.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <div className="flex flex-col bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl min-w-[200px]">
              <span className="text-[10px] uppercase text-mars-primary font-bold mb-1">Impact Prévu</span>
              <span className="text-2xl font-bold">20.22 JUIN</span>
            </div>
            
            <button className="group relative px-8 py-4 rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all w-full md:w-auto flex items-center justify-between gap-4">
              <span className="text-xs font-bold tracking-widest uppercase">Soumettre mon film</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 17L17 7M17 7H7M17 7v10"></path></svg>
            </button>
          </div>
        </div>
        
        <div className="absolute bottom-8 animate-bounce text-gray-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </header>

    </div>
  );
};

export default HomePage;
