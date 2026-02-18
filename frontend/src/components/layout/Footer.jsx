import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { newsletterService } from '../../services/newsletterService';

const Footer = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setStatus('error');
      setMessage(t('footer.enterEmail'));
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await newsletterService.subscribe(email);
      setStatus('success');
      setMessage(response.message);
      setEmail('');

      // Reset le message après 5 secondes
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);
    } catch (error) {
      setStatus('error');
      setMessage(error.message || t('footer.errorOccurred'));

      // Reset le message après 5 secondes
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);
    }
  };

  return (
    <footer className="bg-black border-t border-white/5 pt-20 pb-10 px-6">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">

          {/* Brand Column */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            <Link to="/" className="text-2xl font-black tracking-tighter italic text-white">
              mars<span className="mars-gradient-text" style={{ display: 'inline-block', paddingRight: '3px' }}>AI</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              {t('footer.description')}
            </p>

            {/* Newsletter Form */}
            <div className="mt-4">
              <h4 className="text-xs font-bold tracking-[0.2em] text-gray-500 uppercase mb-4">{t('footer.newsletter')}</h4>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('footer.emailPlaceholder')}
                    disabled={status === 'loading'}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-mars-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold tracking-widest uppercase hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, #51A2FF, #AD46FF, #FF2B7F)' }}
                >
                  {status === 'loading' ? t('footer.sending') : t('footer.subscribe')}
                </button>

                {/* Message de feedback */}
                {message && (
                  <p className={`text-xs ${status === 'success' ? 'text-green-400' : 'text-red-400'} animate-fade-in`}>
                    {message}
                  </p>
                )}
              </form>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] text-gray-500 uppercase mb-8">{t('footer.navigation')}</h4>
            <ul className="flex flex-col gap-4">
              <li><Link to="/programme" className="text-gray-400 hover:text-white transition-colors text-sm">{t('footer.programme')}</Link></li>
              <li><Link to="/films" className="text-gray-400 hover:text-white transition-colors text-sm">{t('footer.films')}</Link></li>
              <li><Link to="/jury" className="text-gray-400 hover:text-white transition-colors text-sm">{t('footer.jury')}</Link></li>
              <li><Link to="/billetterie" className="text-gray-400 hover:text-white transition-colors text-sm">{t('footer.ticketing')}</Link></li>
            </ul>
          </div>

          {/* Compétition */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] text-gray-500 uppercase mb-8">{t('footer.competition')}</h4>
            <ul className="flex flex-col gap-4">
              <li><Link to="/reglement" className="text-gray-400 hover:text-white transition-colors text-sm">{t('footer.rules')}</Link></li>
              <li><Link to="/soumission" className="text-gray-400 hover:text-white transition-colors text-sm">{t('footer.submission')}</Link></li>
              <li><Link to="/prix" className="text-gray-400 hover:text-white transition-colors text-sm">{t('footer.prizes')}</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-white transition-colors text-sm">{t('footer.faq')}</Link></li>
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] text-gray-500 uppercase mb-8">{t('footer.legal')}</h4>
            <ul className="flex flex-col gap-4">
              <li><Link to="/mentions" className="text-gray-400 hover:text-white transition-colors text-sm">{t('footer.legalNotice')}</Link></li>
              <li><Link to="/confidentialite" className="text-gray-400 hover:text-white transition-colors text-sm">{t('footer.privacy')}</Link></li>
              <li><Link to="/cookies" className="text-gray-400 hover:text-white transition-colors text-sm">{t('footer.cookies')}</Link></li>
              <li><Link to="/presse" className="text-gray-400 hover:text-white transition-colors text-sm">{t('footer.press')}</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-10 border-t border-white/5 gap-6">
          <p className="text-gray-600 text-[10px] tracking-[0.1em] uppercase">
            {t('footer.copyright')}
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
