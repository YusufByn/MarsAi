import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';

const EditVideo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    // Médias
    youtube_url: '',
    video_file: null,
    cover_file: null,
    srt_file: null,

    // Titres
    title: '',
    title_en: '',

    // Synopsis
    synopsis: '',
    synopsis_en: '',

    // Métadonnées
    language: '',
    country: '',
    duration: '',
    classification: 'hybrid',
    tech_resume: '',
    creative_resume: '',

    // Infos réalisateur
    realisator_name: '',
    realisator_lastname: '',
    realisator_gender: '',
    email: '',
    birthday: '',
    mobile_number: '',
    fixe_number: '',
    address: '',
    acquisition_source: ''
  });

  // Valider le token au chargement
  useEffect(() => {
    if (!token) {
      setError('Token de modification manquant. Veuillez utiliser le lien reçu par email.');
      setLoading(false);
      return;
    }

    validateToken();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, id]);

  const validateToken = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/upload/${id}/validate-token?token=${token}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.reason || data.message || 'Token invalide');
      }

      // Token valide : pré-remplir le formulaire
      const video = data.data.video;
      setFormData({
        youtube_url: video.youtube_url || '',
        video_file: null,
        cover_file: null,
        srt_file: null,
        title: video.title || '',
        title_en: video.title_en || '',
        synopsis: video.synopsis || '',
        synopsis_en: video.synopsis_en || '',
        language: video.language || '',
        country: video.country || '',
        duration: video.duration || '',
        classification: video.classification || 'hybrid',
        tech_resume: video.tech_resume || '',
        creative_resume: video.creative_resume || '',
        realisator_name: video.realisator_name || '',
        realisator_lastname: video.realisator_lastname || '',
        realisator_gender: video.realisator_gender || '',
        email: video.email || '',
        birthday: video.birthday || '',
        mobile_number: video.mobile_number || '',
        fixe_number: video.fixe_number || '',
        address: video.address || '',
        acquisition_source: video.acquisition_source || ''
      });

      setTimeLeft(data.data.token_info);
      setTokenValid(true);
      setLoading(false);
    } catch (err) {
      console.error('Erreur validation token:', err);
      setError(err.message);
      setTokenValid(false);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      // Créer le FormData pour l'upload
      const formDataToSend = new FormData();

      // Ajouter les champs texte
      Object.keys(formData).forEach((key) => {
        if (key !== 'video_file' && key !== 'cover_file' && key !== 'srt_file') {
          if (formData[key] !== null && formData[key] !== '') {
            formDataToSend.append(key, formData[key]);
          }
        }
      });

      // Ajouter les fichiers seulement si sélectionnés
      if (formData.video_file) {
        formDataToSend.append('video', formData.video_file);
      }
      if (formData.cover_file) {
        formDataToSend.append('cover', formData.cover_file);
      }
      if (formData.srt_file) {
        formDataToSend.append('srt', formData.srt_file);
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/upload/${id}/update?token=${token}`,
        {
          method: 'PUT',
          body: formDataToSend
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Erreur lors de la mise à jour');
      }

      setStatus('success');
      setMessage('Vidéo mise à jour avec succès !');

      // Rediriger après 2 secondes
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      console.error('Erreur soumission:', err);
      setStatus('error');
      setMessage(err.message);
    }
  };

  // État de chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-white/20 border-t-mars-primary rounded-full animate-spin mb-4"></div>
          <p className="text-lg text-white/60">Vérification du lien de modification...</p>
        </div>
      </div>
    );
  }

  // Token invalide
  if (!tokenValid || error) {
    return (
      <div className="min-h-screen bg-black text-white px-6 pt-32 pb-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 border-2 border-red-500/20 mb-6">
            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>

          <h1 className="text-4xl font-black mb-4">Lien invalide ou expiré</h1>
          <p className="text-lg text-white/60 mb-8">{error}</p>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left space-y-4">
            <h2 className="font-bold text-lg">Raisons possibles :</h2>
            <ul className="space-y-2 text-white/70">
              <li className="flex items-start gap-2">
                <span className="text-mars-primary mt-1">•</span>
                <span>Le lien a expiré (validité : 24 heures)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-mars-primary mt-1">•</span>
                <span>Le lien a déjà été utilisé pour modifier la vidéo</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-mars-primary mt-1">•</span>
                <span>Le lien n'est pas complet ou a été altéré</span>
              </li>
            </ul>
          </div>

          <div className="mt-8">
            <p className="text-white/60 mb-4">
              Pour obtenir un nouveau lien de modification, contactez l'équipe MarsAI à{' '}
              <a href="mailto:contact@marsai.com" className="text-mars-primary hover:underline">
                contact@marsai.com
              </a>
            </p>
            <button
              onClick={() => navigate('/')}
              className="mars-button-outline"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Formulaire de modification
  return (
    <div className="min-h-screen bg-black text-white px-6 pt-32 pb-20">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-mars-primary/5 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter italic">
            Modifier votre <span className="mars-text-gradient">Film</span>
          </h1>
          <p className="text-lg text-white/40 font-light max-w-2xl mx-auto">
            Mettez à jour les informations de votre soumission
          </p>
        </div>

        {/* Token expiration warning */}
        {timeLeft && (
          <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-4 flex items-center gap-3">
            <svg className="w-6 h-6 text-orange-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p className="text-sm text-orange-100">
              Ce lien expire dans <strong>{timeLeft.expires_in_hours}h {timeLeft.expires_in_minutes}min</strong>.
              Vous pouvez modifier votre vidéo une seule fois avec ce lien.
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 space-y-6">
            {/* Section 1: Médias */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="text-mars-primary">01</span>
                <span>Médias & Contenu</span>
              </h2>

              <div className="space-y-2">
                <label className="text-xs text-gray-400 uppercase tracking-wider">
                  YouTube URL (optionnel)
                </label>
                <input
                  type="url"
                  name="youtube_url"
                  value={formData.youtube_url}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-mars-primary/50"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 uppercase tracking-wider">
                    Remplacer la vidéo (optionnel)
                  </label>
                  <input
                    type="file"
                    name="video_file"
                    onChange={handleChange}
                    accept="video/*"
                    className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-mars-primary/20 file:text-white file:cursor-pointer hover:file:bg-mars-primary/30 focus:outline-none focus:ring-2 focus:ring-mars-primary/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-gray-400 uppercase tracking-wider">
                    Remplacer la cover (optionnel)
                  </label>
                  <input
                    type="file"
                    name="cover_file"
                    onChange={handleChange}
                    accept="image/*"
                    className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-mars-primary/20 file:text-white file:cursor-pointer hover:file:bg-mars-primary/30 focus:outline-none focus:ring-2 focus:ring-mars-primary/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-gray-400 uppercase tracking-wider">
                  Remplacer les sous-titres (optionnel)
                </label>
                <input
                  type="file"
                  name="srt_file"
                  onChange={handleChange}
                  accept=".srt"
                  className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-mars-primary/20 file:text-white file:cursor-pointer hover:file:bg-mars-primary/30 focus:outline-none focus:ring-2 focus:ring-mars-primary/50"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 uppercase tracking-wider">
                    Titre (VO) *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-mars-primary/50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-gray-400 uppercase tracking-wider">
                    Titre (English) *
                  </label>
                  <input
                    type="text"
                    name="title_en"
                    value={formData.title_en}
                    onChange={handleChange}
                    className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-mars-primary/50"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 uppercase tracking-wider">
                    Synopsis (VO) *
                  </label>
                  <textarea
                    name="synopsis"
                    value={formData.synopsis}
                    onChange={handleChange}
                    rows="4"
                    className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-mars-primary/50 resize-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-gray-400 uppercase tracking-wider">
                    Synopsis (English) *
                  </label>
                  <textarea
                    name="synopsis_en"
                    value={formData.synopsis_en}
                    onChange={handleChange}
                    rows="4"
                    className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-mars-primary/50 resize-none"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="h-px bg-white/10"></div>

            {/* Section 2: Métadonnées */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="text-mars-primary">02</span>
                <span>Classification</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 uppercase tracking-wider">
                    Langue
                  </label>
                  <input
                    type="text"
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-mars-primary/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-gray-400 uppercase tracking-wider">
                    Pays
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-mars-primary/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-gray-400 uppercase tracking-wider">
                    Durée (secondes)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-mars-primary/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-gray-400 uppercase tracking-wider">
                  Classification IA *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.classification === 'ia'
                      ? 'border-mars-primary bg-mars-primary/10'
                      : 'border-white/10 bg-black/40 hover:border-white/20'
                  }`}>
                    <input
                      type="radio"
                      name="classification"
                      value="ia"
                      checked={formData.classification === 'ia'}
                      onChange={handleChange}
                      className="w-4 h-4 accent-mars-primary"
                    />
                    <div className="text-left">
                      <p className="font-semibold">Full AI</p>
                      <p className="text-xs text-white/50">100% AI-generated</p>
                    </div>
                  </label>

                  <label className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.classification === 'hybrid'
                      ? 'border-mars-primary bg-mars-primary/10'
                      : 'border-white/10 bg-black/40 hover:border-white/20'
                  }`}>
                    <input
                      type="radio"
                      name="classification"
                      value="hybrid"
                      checked={formData.classification === 'hybrid'}
                      onChange={handleChange}
                      className="w-4 h-4 accent-mars-primary"
                    />
                    <div className="text-left">
                      <p className="font-semibold">Hybrid</p>
                      <p className="text-xs text-white/50">AI + Human creativity</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-gray-400 uppercase tracking-wider">
                  Résumé technique
                </label>
                <textarea
                  name="tech_resume"
                  value={formData.tech_resume}
                  onChange={handleChange}
                  rows="3"
                  className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-mars-primary/50 resize-none"
                  placeholder="Outils IA utilisés..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-gray-400 uppercase tracking-wider">
                  Résumé créatif
                </label>
                <textarea
                  name="creative_resume"
                  value={formData.creative_resume}
                  onChange={handleChange}
                  rows="3"
                  className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-mars-primary/50 resize-none"
                  placeholder="Méthodologie créative..."
                />
              </div>
            </div>

            <div className="h-px bg-white/10"></div>

            {/* Section 3: Infos réalisateur */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="text-mars-primary">03</span>
                <span>Informations réalisateur</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 uppercase tracking-wider">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    name="realisator_name"
                    value={formData.realisator_name}
                    onChange={handleChange}
                    className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-mars-primary/50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-gray-400 uppercase tracking-wider">
                    Nom *
                  </label>
                  <input
                    type="text"
                    name="realisator_lastname"
                    value={formData.realisator_lastname}
                    onChange={handleChange}
                    className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-mars-primary/50"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 uppercase tracking-wider">
                    Genre *
                  </label>
                  <select
                    name="realisator_gender"
                    value={formData.realisator_gender}
                    onChange={handleChange}
                    className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-mars-primary/50"
                    required
                  >
                    <option value="">Select...</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not">Prefer not to say</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-gray-400 uppercase tracking-wider">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-mars-primary/50"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 uppercase tracking-wider">
                    Date de naissance
                  </label>
                  <input
                    type="date"
                    name="birthday"
                    value={formData.birthday}
                    onChange={handleChange}
                    className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-mars-primary/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-gray-400 uppercase tracking-wider">
                    Mobile
                  </label>
                  <input
                    type="tel"
                    name="mobile_number"
                    value={formData.mobile_number}
                    onChange={handleChange}
                    className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-mars-primary/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-gray-400 uppercase tracking-wider">
                    Fixe
                  </label>
                  <input
                    type="tel"
                    name="fixe_number"
                    value={formData.fixe_number}
                    onChange={handleChange}
                    className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-mars-primary/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-gray-400 uppercase tracking-wider">
                  Adresse
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-mars-primary/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-gray-400 uppercase tracking-wider">
                  Comment avez-vous connu MarsAI ?
                </label>
                <input
                  type="text"
                  name="acquisition_source"
                  value={formData.acquisition_source}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-mars-primary/50"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-3 rounded-xl border border-white/10 bg-white/5 text-sm font-semibold uppercase tracking-wider hover:bg-white/10 transition-all"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-8 py-3 rounded-xl bg-white text-black text-sm font-bold uppercase tracking-wider hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {status === 'loading' ? 'Mise à jour...' : 'Enregistrer les modifications'}
            </button>
          </div>

          {/* Status Message */}
          {message && (
            <div
              className={`text-center text-sm font-medium p-4 rounded-xl ${
                status === 'error'
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                  : 'bg-green-500/10 text-green-400 border border-green-500/20'
              }`}
            >
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditVideo;
