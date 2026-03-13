import { useTranslation } from 'react-i18next';

const LanguageToggle = () => {
  const { i18n } = useTranslation();
  const isEnglish = i18n.language === 'en';

  const toggleLanguage = () => {
    i18n.changeLanguage(isEnglish ? 'fr' : 'en');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-sm font-medium"
    >
      <span className={isEnglish ? 'text-white' : 'text-white/40'}>EN</span>
      <span className="text-white/20">|</span>
      <span className={!isEnglish ? 'text-white' : 'text-white/40'}>FR</span>
    </button>
  );
};

export default LanguageToggle;
