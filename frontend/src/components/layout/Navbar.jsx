import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import LanguageToggle from '../LanguageToggle';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isSelector, isAdmin, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // location is used to trigger re-renders on route change
  void location;

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = searchValue.trim();
    if (!trimmed) return;
    navigate(`/videos?q=${encodeURIComponent(trimmed)}`);
    setSearchValue('');
    setSearchOpen(false);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[9999]">
      <div className="px-4 pt-3 flex justify-center">
      <div className="relative w-full max-w-4xl flex items-center justify-between h-12 px-4 rounded-full border border-white/[0.08] bg-[#050505]"
      >

        {/* Logo */}
        <Link to="/" className="flex items-center shrink-0" onClick={closeMenu}>
          <span className="text-xl font-black tracking-tighter italic text-white">
            mars<span className="mars-gradient-text" style={{ display: 'inline-block', paddingRight: '3px' }}>AI</span>
          </span>
        </Link>

        {/* Navigation Centrale - Desktop — centré dans le pill */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-5 bg-white/[0.04] px-5 py-1.5 rounded-full border border-white/[0.06]">
          <Link to="/" className="text-white/40 hover:text-white transition-colors" title="Accueil" aria-label="Accueil">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </Link>

          <Link to="/jury" className="text-white/40 hover:text-white transition-colors" title="Jury" aria-label="Jury">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </Link>

          {/* Liens spécifiques aux jurys (sélecteurs) */}
          {isSelector && (
            <>
              <Link to="/videos" className="text-white/40 hover:text-white transition-colors" title="Liste des videos" aria-label="Liste des videos">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </Link>

              <Link to="/video/player" className="text-white/40 hover:text-white transition-colors" title="Player" aria-label="Player video">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </Link>

              <Link to="/selector" className="text-white/40 hover:text-white transition-colors" title="Mon profil selecteur" aria-label="Mon profil selecteur">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>

              <div className="relative flex items-center">
                {searchOpen ? (
                  <form onSubmit={handleSearch} className="flex items-center">
                    <input
                      type="text"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      placeholder="Titre, realisateur, tag..."
                      autoFocus
                      onBlur={() => { if (!searchValue) setSearchOpen(false); }}
                      className="w-40 bg-white/10 border border-white/20 rounded-full px-3 py-1 text-xs text-white placeholder-white/40 focus:outline-none"
                    />
                  </form>
                ) : (
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="text-white/40 hover:text-white transition-colors"
                    title="Rechercher un film"
                    aria-label="Rechercher un film"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                )}
              </div>
            </>
          )}

          {isAdmin && (
            <Link to="/admin/dashboard" className="text-white/40 hover:text-white transition-colors" title="Administration" aria-label="Administration">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Link>
          )}
        </div>

        {/* Actions Droite */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <LanguageToggle />

          {/* Mobile: bouton burger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg bg-white/8 hover:bg-white/15 transition-colors"
            aria-label="Menu de navigation"
          >
            {menuOpen ? (
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>
      </div>

      {/* Overlay mobile — plein écran */}
      <div
        className={`md:hidden fixed inset-0 z-[99] transition-all duration-300 ease-in-out ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Fond sombre cliquable */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeMenu} />

        {/* Panneau latéral droit */}
        <div
          className={`absolute top-0 right-0 h-full w-[85vw] max-w-[340px] bg-[#080808] border-l border-white/[0.06] flex flex-col transition-transform duration-300 ease-in-out ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Header du panneau */}
          <div className="flex items-center justify-between px-5 h-14 border-b border-white/[0.06] shrink-0">
            <span className="text-base font-black tracking-tighter italic text-white">
              mars<span className="mars-gradient-text" style={{ display: 'inline-block', paddingRight: '3px' }}>AI</span>
            </span>
            <button
              onClick={closeMenu}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Contenu scrollable */}
          <div className="flex-1 overflow-y-auto py-4 px-4 space-y-1">

            {/* Carte utilisateur */}
            {user && (
              <div className="flex items-center gap-3 px-3 py-3 mb-3 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0"
                  style={{ background: 'linear-gradient(135deg, #2B7FFF, #AD46FF)' }}
                >
                  {user.name?.[0]?.toUpperCase()}{user.lastname?.[0]?.toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{user.name} {user.lastname}</p>
                  <p className="text-white/30 text-[11px] truncate">{user.email}</p>
                </div>
              </div>
            )}

            {/* Label section */}
            <p className="px-3 text-[9px] tracking-[0.3em] uppercase text-white/20 font-bold mb-1">Navigation</p>

            {/* Liens principaux */}
            <Link to="/" onClick={closeMenu} className="group flex items-center justify-between px-3 py-3 rounded-xl hover:bg-white/[0.05] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">Accueil</span>
              </div>
              <svg className="w-3.5 h-3.5 text-white/20 group-hover:text-white/40 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <Link to="/jury" onClick={closeMenu} className="group flex items-center justify-between px-3 py-3 rounded-xl hover:bg-white/[0.05] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">Jury</span>
              </div>
              <svg className="w-3.5 h-3.5 text-white/20 group-hover:text-white/40 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            {/* Section jury/sélecteur */}
            {isSelector && (
              <>
                <p className="px-3 text-[9px] tracking-[0.3em] uppercase text-white/20 font-bold mt-4 mb-1">Espace Jury</p>

                {/* Recherche */}
                <form onSubmit={handleSearch} className="px-1 mb-1">
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      placeholder="Rechercher un film..."
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-white/25 focus:outline-none focus:border-white/20 transition-colors"
                    />
                  </div>
                </form>

                <Link to="/videos" onClick={closeMenu} className="group flex items-center justify-between px-3 py-3 rounded-xl hover:bg-white/[0.05] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">Films en compétition</span>
                  </div>
                  <svg className="w-3.5 h-3.5 text-white/20 group-hover:text-white/40 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>

                <Link to="/video/player" onClick={closeMenu} className="group flex items-center justify-between px-3 py-3 rounded-xl hover:bg-white/[0.05] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">Player</span>
                  </div>
                  <svg className="w-3.5 h-3.5 text-white/20 group-hover:text-white/40 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>

                <Link to="/selector" onClick={closeMenu} className="group flex items-center justify-between px-3 py-3 rounded-xl hover:bg-white/[0.05] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">Mon profil</span>
                  </div>
                  <svg className="w-3.5 h-3.5 text-white/20 group-hover:text-white/40 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </>
            )}

            {/* Section admin */}
            {isAdmin && (
              <>
                <p className="px-3 text-[9px] tracking-[0.3em] uppercase text-white/20 font-bold mt-4 mb-1">Admin</p>
                <Link to="/admin/dashboard" onClick={closeMenu} className="group flex items-center justify-between px-3 py-3 rounded-xl hover:bg-white/[0.05] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">Administration</span>
                  </div>
                  <svg className="w-3.5 h-3.5 text-white/20 group-hover:text-white/40 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </>
            )}
          </div>

          {/* Footer du panneau */}
          <div className="px-4 pb-6 pt-4 border-t border-white/[0.06] shrink-0 space-y-2">
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Deconnexion
              </button>
            ) : (
              <>
                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="w-full flex items-center justify-center py-3 rounded-xl text-sm font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #2B7FFF, #AD46FF)' }}
                >
                  Créer un compte
                </Link>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="w-full flex items-center justify-center py-3 rounded-xl border border-white/10 text-sm font-medium text-white/60 hover:text-white hover:border-white/20 transition-colors"
                >
                  Connexion
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
    
  );
};

export default Navbar;
