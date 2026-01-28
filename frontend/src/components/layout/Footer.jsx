import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/5 pt-20 pb-10 px-6">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          
          {/* Brand Column */}
          <div className="flex flex-col gap-6">
            <Link to="/" className="text-2xl font-black tracking-tighter text-white">
              MARS<span className="mars-text-gradient">AI</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              La plateforme mondiale de la narration générative. Explorez le futur du cinéma propulsé par l'intelligence artificielle.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] text-gray-500 uppercase mb-8">Navigation</h4>
            <ul className="flex flex-col gap-4">
              <li><Link to="/programme" className="text-gray-400 hover:text-white transition-colors text-sm">Programme</Link></li>
              <li><Link to="/films" className="text-gray-400 hover:text-white transition-colors text-sm">Films</Link></li>
              <li><Link to="/jury" className="text-gray-400 hover:text-white transition-colors text-sm">Jury</Link></li>
              <li><Link to="/billetterie" className="text-gray-400 hover:text-white transition-colors text-sm">Billetterie</Link></li>
            </ul>
          </div>

          {/* Compétition */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] text-gray-500 uppercase mb-8">Compétition</h4>
            <ul className="flex flex-col gap-4">
              <li><Link to="/reglement" className="text-gray-400 hover:text-white transition-colors text-sm">Règlement</Link></li>
              <li><Link to="/soumission" className="text-gray-400 hover:text-white transition-colors text-sm">Soumission</Link></li>
              <li><Link to="/prix" className="text-gray-400 hover:text-white transition-colors text-sm">Prix</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-white transition-colors text-sm">FAQ</Link></li>
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] text-gray-500 uppercase mb-8">Légal</h4>
            <ul className="flex flex-col gap-4">
              <li><Link to="/mentions" className="text-gray-400 hover:text-white transition-colors text-sm">Mentions</Link></li>
              <li><Link to="/confidentialite" className="text-gray-400 hover:text-white transition-colors text-sm">Confidentialité</Link></li>
              <li><Link to="/cookies" className="text-gray-400 hover:text-white transition-colors text-sm">Cookies</Link></li>
              <li><Link to="/presse" className="text-gray-400 hover:text-white transition-colors text-sm">Presse</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-10 border-t border-white/5 gap-6">
          <p className="text-gray-600 text-[10px] tracking-[0.1em] uppercase">
            © 2026 MARSAI PROTOCOL — TOUS DROITS RÉSERVÉS
          </p>
          <div className="flex items-center gap-8">
            <a href="#" className="text-gray-600 hover:text-white transition-colors text-[10px] tracking-[0.1em] uppercase font-bold">Twitter</a>
            <a href="#" className="text-gray-600 hover:text-white transition-colors text-[10px] tracking-[0.1em] uppercase font-bold">Instagram</a>
            <a href="#" className="text-gray-600 hover:text-white transition-colors text-[10px] tracking-[0.1em] uppercase font-bold">Linkedin</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
