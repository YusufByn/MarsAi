import React, { useState } from 'react';

const ParticipationSocialNetworks = ({ realisatorSocialNetworks, setRealisatorSocialNetworks, onSave }) => {
  // S'assurer que realisatorSocialNetworks est un objet
  const socialNetworks = realisatorSocialNetworks || {
    facebook: '',
    instagram: '',
    X: '',
    LinkedIn: '',
    youtube: '',
    TikTok: '',
    other: '',
  };

  const [errors, setErrors] = useState({});

  // Fonction pour gérer les changements de valeurs
  const handleChange = (platform, value) => {
    setRealisatorSocialNetworks({
      ...socialNetworks,
      [platform]: value
    });
    
    // Effacer l'erreur du champ modifié
    if (errors[platform]) {
      setErrors({ ...errors, [platform]: null });
    }
  };

  // Validation d'une URL (optionnelle)
  const validateUrl = (url) => {
    if (!url) return true; // Les champs sont optionnels
    
    try {
      const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w._~:/?#[\]@!$&'()*+,;=-]*)?$/;
      return urlPattern.test(url);
    } catch {
      return false;
    }
  };

  // Fonction pour sauvegarder les données des réseaux sociaux
  const handleSaveSocialNetworks = () => {
    const newErrors = {};
    
    // Validation des URLs
    Object.keys(socialNetworks).forEach(platform => {
      if (socialNetworks[platform] && !validateUrl(socialNetworks[platform])) {
        newErrors[platform] = 'Invalid URL';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSave();
  };

  const socialNetworksList = [
    { key: 'facebook', label: 'Facebook', icon: '📘', placeholder: 'https://facebook.com/yourprofile' },
    { key: 'instagram', label: 'Instagram', icon: '📷', placeholder: 'https://instagram.com/yourprofile' },
    { key: 'X', label: 'X (Twitter)', icon: '🐦', placeholder: 'https://x.com/yourprofile' },
    { key: 'LinkedIn', label: 'LinkedIn', icon: '💼', placeholder: 'https://linkedin.com/in/yourprofile' },
    { key: 'youtube', label: 'YouTube', icon: '🎥', placeholder: 'https://youtube.com/@yourchannel' },
    { key: 'TikTok', label: 'TikTok', icon: '🎵', placeholder: 'https://tiktok.com/@yourprofile' },
    { key: 'other', label: 'Other', icon: '🔗', placeholder: 'https://yourwebsite.com' },
  ];

  return (
    <div className="text-center text-white">
      <div className="mb-5">
        <h2 className="text-xl font-semibold tracking-tight">Social Networks</h2>
        <p className="text-gray-400 text-xs mt-1">Please enter the URL of your social media profiles</p>
      </div>

      <section className="FormSocialNetworks">
        <div className="grid grid-cols-1 justify-items-center m-2 gap-3">
          {socialNetworksList.map(({ key, icon, placeholder }) => (
            <div key={key} className="w-full max-w-md">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">
                  {icon}
                </span>
                <input 
                  className={`bg-[#0f0f14] border rounded-xl px-3 py-2.5 w-full pl-12 text-white text-sm transition-colors ${
                    errors[key] ? 'border-rose-500' : 'border-white/15 focus:border-fuchsia-400/70'
                  } placeholder:text-gray-500`}
                  type="text"
                  name={key}
                  value={socialNetworks[key] || ''}
                  onChange={(e) => handleChange(key, e.target.value)}
                  placeholder={placeholder}
                />
              </div>
              {errors[key] && (
                <p className="text-rose-400 text-xs mt-1 text-left pl-1">{errors[key]}</p>
              )}
            </div>
          ))}

          {/* Bouton de sauvegarde */}
          <div className="flex justify-center mt-4">
            <button
              type="button"
              onClick={handleSaveSocialNetworks}
              className="bg-linear-to-r from-violet-600 to-fuchsia-600 text-white border border-white/10 rounded-xl px-6 py-2.5 hover:from-violet-500 hover:to-fuchsia-500 transition-all font-semibold text-sm shadow-[0_8px_24px_rgba(168,85,247,0.35)]"
            >
              Save and continue
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ParticipationSocialNetworks;