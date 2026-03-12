import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageToggle from '../LanguageToggle';
import { useAuth } from '../../hooks/useAuth';
import NavbarSearch from './NavbarSearch';
import MobileSearchOverlay from './MobileSearchOverlay';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { user, isSelector, isAdmin, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  // const [searchOpen, setSearchOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  void location;

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = searchValue.trim();
    if (!trimmed) return;
    navigate(`/videos?q=${encodeURIComponent(trimmed)}`);
    setSearchValue('');
    // setSearchOpen(false);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] glass-navbar">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-20 relative flex items-center">

        {/* Logo - mobile uniquement */}
        <Link to="/" onClick={closeMenu} className="md:hidden flex items-center">
          <span className="text-xl font-black tracking-tighter text-white">
            mars<span className="mars-text-gradient">AI</span>
          </span>
        </Link>

        {/* ===== Pill centré - desktop ===== */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center">
          <div className="flex items-center bg-black/60 backdrop-blur-md px-2 py-1.5 rounded-full border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] gap-0.5">

            {/* Logo dans la pill */}
            <Link
              to="/"
              onClick={closeMenu}
              className="flex items-center px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors mr-1"
            >
              <span className="text-base font-black tracking-tighter text-white whitespace-nowrap">
                mars<span className="mars-text-gradient">AI</span>
              </span>
            </Link>

            <div className="w-px h-4 bg-white/10" />

            {/* Lien Home */}
            <Link
              to="/"
              className="p-2.5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              title={t('navbar.home')}
              aria-label={t('navbar.home')}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </Link>

            {/* Lien Jury */}
            <Link
              to="/jury"
              className="p-2.5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              title={t('navbar.jury')}
              aria-label={t('navbar.jury')}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </Link>
            {/* Recherche autocomplete */}
            <NavbarSearch onAfterNavigate={() => setMenuOpen(false)} />


            {/* Liens jury/selector */}
            {isSelector && (
              <>
                <Link
                  to="/videos"
                  className="p-2.5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                  title={t('navbar.videoList')}
                  aria-label={t('navbar.videoList')}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </Link>

                <Link
                  to="/video/player"
                  className="p-2.5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                  title={t('navbar.player')}
                  aria-label={t('navbar.player')}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </Link>

                <Link
                  to="/selector"
                  className="p-2.5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                  title={t('navbar.selectorProfile')}
                  aria-label={t('navbar.selectorProfile')}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Link>

                {/* Recherche */}
                {/* <div className="relative flex items-center">
                  {searchOpen ? (
                    <form onSubmit={handleSearch} className="flex items-center px-1">
                      <input
                        type="text"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder={t('navbar.searchPlaceholder')}
                        autoFocus
                        onBlur={() => { if (!searchValue) setSearchOpen(false); }}
                        className="w-40 bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-mars-primary/50"
                      />
                    </form>
                  ) : (
                    <button
                      onClick={() => setSearchOpen(true)}
                      className="p-2.5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                      title={t('navbar.searchFilm')}
                      aria-label={t('navbar.searchFilm')}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                  )}
                </div> */}
              </>
            )}

            {/* Lien admin */}
            {isAdmin && (
              <>
                <div className="w-px h-4 bg-white/10 mx-0.5" />
                <Link
                  to="/admin/dashboard"
                  className="p-2.5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                  title={t('navbar.admin')}
                  aria-label={t('navbar.admin')}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </Link>
              </>
            )}

            {/* Séparateur + Logout si connecté */}
            {user && (
              <>
                <div className="w-px h-4 bg-white/10 mx-0.5" />
                <div className="flex items-center gap-1 pl-1 pr-0.5">
                  <span className="text-xs text-white/40 hidden lg:block max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="p-2.5 rounded-full text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title={t('navbar.logout')}
                    aria-label={t('navbar.logout')}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ===== Droite: Language + Login (si non connecté) + Hamburger ===== */}
        <div className="ml-auto flex items-center gap-3">
          <LanguageToggle />

          {/* Bouton login - desktop, visible uniquement si non connecté */}
          {!user && (
            <Link
              to="/login"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black text-sm font-bold hover:bg-gray-100 transition-colors"
            >
              {t('navbar.login')}
            </Link>
          )}

          {/* Loupe mobile */}
          <button
            onClick={() => {
              setMenuOpen(false);
              setMobileSearchOpen(true);
            }}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            aria-label={t('navbar.searchFilm')}
            title={t('navbar.searchFilm')}
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Hamburger mobile */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            aria-label={t('navbar.menuLabel')}
          >
            {menuOpen ? (
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ===== Menu mobile déroulant ===== */}
      <div className={`md:hidden absolute top-full left-0 right-0 overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-6 pb-6 pt-2 space-y-1 border-t border-white/10 bg-black/95 backdrop-blur-xl">
          {user && (
            <div className="px-4 py-3 mb-2 rounded-xl bg-white/5 border border-white/10">
              <p className="text-white text-sm font-semibold">{user.name} {user.lastname}</p>
              <p className="text-gray-500 text-xs">{user.email}</p>
            </div>
          )}

          <Link to="/" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-sm">{t('navbar.home')}</span>
          </Link>

          <Link to="/jury" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-sm">{t('navbar.jury')}</span>
          </Link>

          {/* recherche mobile pour tout le monde */}
          <form onSubmit={handleSearch} className="px-4 py-2">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={t('navbar.searchPlaceholder')}
                className="w-full bg-white/10 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-mars-primary/50"
              />
            </div>
          </form>

          {isSelector && (
            <>
              <Link to="/videos" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span className="text-sm">{t('navbar.videoList')}</span>
              </Link>

              <Link to="/video/player" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">{t('navbar.player')}</span>
              </Link>

              <Link to="/selector" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-sm">{t('navbar.selectorProfile')}</span>
              </Link>
            </>
          )}

          {isAdmin && (
            <Link to="/admin/dashboard" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm">{t('navbar.admin')}</span>
            </Link>
          )}

          <div className="pt-2 mt-2 border-t border-white/10">
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="text-sm">{t('navbar.logout')}</span>
              </button>
            ) : (
              <Link
                to="/login"
                onClick={closeMenu}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white bg-white/10 hover:bg-white/20 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="text-sm font-bold">{t('navbar.login')}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
      <MobileSearchOverlay
        open={mobileSearchOpen}
        onClose={() => setMobileSearchOpen(false)}
      />
    </nav>
  );
};

export default Navbar;
