import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreatableSelect from 'react-select/creatable';

const FromVideo = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [existingTags, setExistingTags] = useState([]);

  const [formData, setFormData] = useState({
    // Étape 1 : Médias & Contenu
    youtube_url: '',
    video_file: null,
    srt_file: null,
    cover_file: null,
    still_files: [], // Galerie de screens (max 3)
    title: '',
    title_en: '',
    synopsis: '',
    synopsis_en: '',

    // Étape 2 : Métadonnées & Classification
    language: '',
    country: '',
    duration: '',
    classification: 'hybrid',
    tech_resume: '',
    creative_resume: '',
    tags: [], // Tags pour catégoriser le film

    // Étape 3 : Informations réalisateur
    realisator_name: '',
    realisator_lastname: '',
    realisator_gender: '',
    email: '',
    birthday: '',
    mobile_number: '',
    fixe_number: '',
    address: '',
    postal_code: '',
    city: '',
    country_address: '',
    acquisition_source: '',
    rights_accepted: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === 'file') {
      if (name === 'still_files') {
        // Pour les stills, prendre jusqu'à 3 fichiers
        const fileArray = Array.from(files).slice(0, 3);
        setFormData((prev) => ({ ...prev, [name]: fileArray }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: files[0] }));
      }
    } else if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleTagsChange = (newValue) => {
    setFormData((prev) => ({ ...prev, tags: newValue || [] }));
  };

  // Charger les tags existants au montage du composant
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/tag`);
        const result = await response.json();

        if (result.success) {
          // Convertir les tags en format react-select
          const tagOptions = result.data.map(tag => ({
            value: tag.name,
            label: tag.name
          }));
          setExistingTags(tagOptions);
        }
      } catch (error) {
        console.error('[TAGS] Erreur chargement tags:', error);
      }
    };

    fetchTags();
  }, []);

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return (
          formData.title &&
          formData.title.length >= 2 &&
          formData.title_en &&
          formData.title_en.length >= 2 &&
          formData.synopsis &&
          formData.synopsis.length >= 10 && // Minimum 10 caractères
          formData.synopsis_en &&
          formData.synopsis_en.length >= 10 && // Minimum 10 caractères
          (formData.video_file || formData.youtube_url) && // Au moins une source vidéo
          formData.cover_file
        );
      case 2:
        return formData.classification;
      case 3:
        return (
          formData.realisator_name &&
          formData.realisator_lastname &&
          formData.realisator_gender &&
          formData.email &&
          formData.rights_accepted
        );
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setStatus('loading');
    setMessage('');

    try {
      // Créer le FormData pour l'upload
      const formDataToSend = new FormData();

      // Ajouter les fichiers avec les bons noms attendus par le backend
      if (formData.video_file) {
        formDataToSend.append('video', formData.video_file);
      }
      if (formData.cover_file) {
        formDataToSend.append('cover', formData.cover_file);
      }
      if (formData.srt_file) {
        formDataToSend.append('srt', formData.srt_file);
      }

      // Ajouter les stills (max 3)
      if (formData.still_files && formData.still_files.length > 0) {
        console.log('[SUBMIT] Ajout de', formData.still_files.length, 'stills');
        formData.still_files.forEach((file) => {
          formDataToSend.append('stills', file);
          console.log('[SUBMIT] Still ajouté:', file.name);
        });
      } else {
        console.log('[SUBMIT] Aucun still à envoyer');
      }

      // Ajouter tous les champs texte
      const textFields = [
        'youtube_url',
        'title',
        'title_en',
        'synopsis',
        'synopsis_en',
        'language',
        'country',
        'duration',
        'classification',
        'tech_resume',
        'creative_resume',
        'realisator_name',
        'realisator_lastname',
        'realisator_gender',
        'email',
        'birthday',
        'mobile_number',
        'fixe_number',
        'address',
        'postal_code',
        'city',
        'country_address',
        'acquisition_source'
      ];

      textFields.forEach((field) => {
        if (formData[field] !== null && formData[field] !== '') {
          formDataToSend.append(field, formData[field]);
        }
      });

      // Ajouter rights_accepted (convertir boolean en string)
      formDataToSend.append('rights_accepted', formData.rights_accepted.toString());

      // Ajouter les tags (convertir en JSON)
      if (formData.tags && formData.tags.length > 0) {
        const tagNames = formData.tags.map(tag => tag.value || tag.label);
        formDataToSend.append('tags', JSON.stringify(tagNames));
        console.log('[SUBMIT] Tags envoyés:', tagNames);
      }

      console.log('[SUBMIT] Envoi de la soumission vidéo...');

      // Appel API
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/upload/submit`, {
        method: 'POST',
        body: formDataToSend
        // Ne pas définir Content-Type, le navigateur le fera automatiquement avec boundary
      });

      const result = await response.json();

      if (!response.ok) {
        // Gérer les erreurs de validation
        if (result.errors && Array.isArray(result.errors)) {
          const errorMessages = result.errors.map(err => `${err.field}: ${err.message}`).join('\n');
          throw new Error(errorMessages);
        }
        throw new Error(result.message || 'Erreur lors de la soumission');
      }

      console.log('[SUBMIT] Vidéo soumise avec succès:', result.data);

      setStatus('success');
      setMessage(`Vidéo soumise avec succès ! ID: ${result.data.video_id}`);

      // Rediriger après 2 secondes
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      console.error('[SUBMIT ERROR] Erreur soumission:', error);
      setStatus('error');
      setMessage(error.message || 'Une erreur est survenue lors de la soumission');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 pt-32 pb-20">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-mars-primary/5 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter italic">
            Submit Your <span className="mars-text-gradient">Film</span>
          </h1>
          <p className="text-lg text-white/40 font-light max-w-2xl mx-auto">
            Share your AI-powered creative vision with our jury
          </p>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((step) => (
            <React.Fragment key={step}>
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                  currentStep === step
                    ? 'border-mars-primary bg-mars-primary text-white scale-110'
                    : currentStep > step
                    ? 'border-mars-primary/50 bg-mars-primary/20 text-white'
                    : 'border-white/10 bg-white/5 text-white/40'
                }`}
              >
                <span className="text-sm font-bold">{step}</span>
              </div>
              {step < 3 && (
                <div
                  className={`h-1 w-16 rounded-full transition-all duration-300 ${
                    currentStep > step ? 'bg-mars-primary/50' : 'bg-white/10'
                  }`}
                ></div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step Labels */}
        <div className="grid grid-cols-3 gap-4 text-center mb-8">
          <div className={currentStep === 1 ? 'text-white' : 'text-white/40'}>
            <p className="text-xs uppercase tracking-wider font-semibold">Media & Content</p>
          </div>
          <div className={currentStep === 2 ? 'text-white' : 'text-white/40'}>
            <p className="text-xs uppercase tracking-wider font-semibold">Classification</p>
          </div>
          <div className={currentStep === 3 ? 'text-white' : 'text-white/40'}>
            <p className="text-xs uppercase tracking-wider font-semibold">Director Info</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 space-y-6">
            {/* Step 1: Media & Content */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-bold mb-6">Media & Content</h2>

                <div className="space-y-2">
                  <label className="text-xs text-gray-400 uppercase tracking-wider">
                    YouTube URL
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

                <div className="space-y-2">
                  <label className="text-xs text-gray-400 uppercase tracking-wider">
                    Upload Video File
                  </label>
                  <input
                    type="file"
                    name="video_file"
                    onChange={handleChange}
                    accept="video/*"
                    className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-mars-primary/20 file:text-white file:cursor-pointer hover:file:bg-mars-primary/30 focus:outline-none focus:ring-2 focus:ring-mars-primary/50"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 uppercase tracking-wider">
                      Cover Image *
                    </label>
                    <input
                      type="file"
                      name="cover_file"
                      onChange={handleChange}
                      accept="image/*"
                      className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-mars-primary/20 file:text-white file:cursor-pointer hover:file:bg-mars-primary/30 focus:outline-none focus:ring-2 focus:ring-mars-primary/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 uppercase tracking-wider">
                      Subtitles (SRT)
                    </label>
                    <input
                      type="file"
                      name="srt_file"
                      onChange={handleChange}
                      accept=".srt"
                      className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-mars-primary/20 file:text-white file:cursor-pointer hover:file:bg-mars-primary/30 focus:outline-none focus:ring-2 focus:ring-mars-primary/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-gray-400 uppercase tracking-wider">
                    Film Stills / Gallery (max 3 images)
                  </label>
                  <input
                    type="file"
                    name="still_files"
                    onChange={handleChange}
                    accept="image/*"
                    multiple
                    className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-mars-primary/20 file:text-white file:cursor-pointer hover:file:bg-mars-primary/30 focus:outline-none focus:ring-2 focus:ring-mars-primary/50"
                  />
                  {formData.still_files.length > 0 && (
                    <p className="text-xs text-white/50">
                      {formData.still_files.length} image{formData.still_files.length > 1 ? 's' : ''} selected
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 uppercase tracking-wider">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-mars-primary/50"
                      placeholder="Film title"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 uppercase tracking-wider">
                      Title (English)
                    </label>
                    <input
                      type="text"
                      name="title_en"
                      value={formData.title_en}
                      onChange={handleChange}
                      className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-mars-primary/50"
                      placeholder="English title"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 uppercase tracking-wider">
                      Synopsis *
                    </label>
                    <textarea
                      name="synopsis"
                      value={formData.synopsis}
                      onChange={handleChange}
                      rows="4"
                      className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-mars-primary/50 resize-none"
                      placeholder="Describe your film... (min. 10 characters)"
                    />
                    <p className={`text-xs ${
                      formData.synopsis.length >= 10
                        ? 'text-green-400'
                        : formData.synopsis.length > 0
                        ? 'text-orange-400'
                        : 'text-white/40'
                    }`}>
                      {formData.synopsis.length}/5000 characters {formData.synopsis.length < 10 && formData.synopsis.length > 0 && '(min. 10)'}
                    </p>
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
                      placeholder="English synopsis... (min. 10 characters)"
                    />
                    <p className={`text-xs ${
                      formData.synopsis_en.length >= 10
                        ? 'text-green-400'
                        : formData.synopsis_en.length > 0
                        ? 'text-orange-400'
                        : 'text-white/40'
                    }`}>
                      {formData.synopsis_en.length}/5000 characters {formData.synopsis_en.length < 10 && formData.synopsis_en.length > 0 && '(min. 10)'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Metadata & Classification */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-bold mb-6">Metadata & Classification</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 uppercase tracking-wider">
                      Language *
                    </label>
                    <input
                      type="text"
                      name="language"
                      value={formData.language}
                      onChange={handleChange}
                      className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-mars-primary/50"
                      placeholder="e.g. French"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 uppercase tracking-wider">
                      Country *
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-mars-primary/50"
                      placeholder="e.g. France"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 uppercase tracking-wider">
                      Duration (seconds)
                    </label>
                    <input
                      type="number"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-mars-primary/50"
                      placeholder="e.g. 120"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-gray-400 uppercase tracking-wider">
                    AI Classification *
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
                    Technical Resume
                  </label>
                  <textarea
                    name="tech_resume"
                    value={formData.tech_resume}
                    onChange={handleChange}
                    rows="4"
                    className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-mars-primary/50 resize-none"
                    placeholder="Describe AI tools used (e.g., Midjourney, Runway, Sora...)"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-gray-400 uppercase tracking-wider">
                    Creative Resume
                  </label>
                  <textarea
                    name="creative_resume"
                    value={formData.creative_resume}
                    onChange={handleChange}
                    rows="4"
                    className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-mars-primary/50 resize-none"
                    placeholder="Describe your creative methodology..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-gray-400 uppercase tracking-wider">
                    Tags (Press Enter to add)
                  </label>
                  <CreatableSelect
                    isMulti
                    value={formData.tags}
                    onChange={handleTagsChange}
                    options={existingTags}
                    placeholder="Add tags (e.g., sci-fi, experimental, drama...)"
                    noOptionsMessage={() => 'Type and press Enter to create a tag'}
                    formatCreateLabel={(inputValue) => `Create tag "${inputValue}"`}
                    styles={{
                      control: (base) => ({
                        ...base,
                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '0.75rem',
                        padding: '0.25rem',
                        minHeight: '48px',
                        boxShadow: 'none',
                        '&:hover': {
                          borderColor: 'rgba(139, 92, 246, 0.5)',
                        },
                      }),
                      menu: (base) => ({
                        ...base,
                        backgroundColor: 'rgba(0, 0, 0, 0.95)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '0.75rem',
                        overflow: 'hidden',
                      }),
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isFocused
                          ? 'rgba(139, 92, 246, 0.2)'
                          : 'transparent',
                        color: 'white',
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'rgba(139, 92, 246, 0.3)',
                        },
                      }),
                      multiValue: (base) => ({
                        ...base,
                        backgroundColor: 'rgba(139, 92, 246, 0.2)',
                        borderRadius: '0.5rem',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                      }),
                      multiValueLabel: (base) => ({
                        ...base,
                        color: 'white',
                        padding: '0.25rem 0.5rem',
                      }),
                      multiValueRemove: (base) => ({
                        ...base,
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&:hover': {
                          backgroundColor: 'rgba(139, 92, 246, 0.4)',
                          color: 'white',
                        },
                      }),
                      input: (base) => ({
                        ...base,
                        color: 'white',
                      }),
                      placeholder: (base) => ({
                        ...base,
                        color: 'rgba(255, 255, 255, 0.3)',
                      }),
                    }}
                  />
                  <p className="text-xs text-white/40">
                    Type a tag name and press Enter. You can add multiple tags.
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Director Information */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-bold mb-6">Director Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 uppercase tracking-wider">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="realisator_name"
                      value={formData.realisator_name}
                      onChange={handleChange}
                      className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-mars-primary/50"
                      placeholder="John"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 uppercase tracking-wider">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="realisator_lastname"
                      value={formData.realisator_lastname}
                      onChange={handleChange}
                      className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-mars-primary/50"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 uppercase tracking-wider">
                      Gender
                    </label>
                    <select
                      name="realisator_gender"
                      value={formData.realisator_gender}
                      onChange={handleChange}
                      className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-mars-primary/50"
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
                      Birthday
                    </label>
                    <input
                      type="date"
                      name="birthday"
                      value={formData.birthday}
                      onChange={handleChange}
                      className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-mars-primary/50"
                    />
                  </div>
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
                    placeholder="director@example.com"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 uppercase tracking-wider">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      name="mobile_number"
                      value={formData.mobile_number}
                      onChange={handleChange}
                      className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-mars-primary/50"
                      placeholder="+33 6 12 34 56 78"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 uppercase tracking-wider">
                      Landline Number
                    </label>
                    <input
                      type="tel"
                      name="fixe_number"
                      value={formData.fixe_number}
                      onChange={handleChange}
                      className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-mars-primary/50"
                      placeholder="+33 1 23 45 67 89"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-gray-400 uppercase tracking-wider">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-mars-primary/50"
                    placeholder="123 Main Street, Apt 4B"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 uppercase tracking-wider">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="postal_code"
                      value={formData.postal_code}
                      onChange={handleChange}
                      className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-mars-primary/50"
                      placeholder="75001"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 uppercase tracking-wider">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-mars-primary/50"
                      placeholder="Paris"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 uppercase tracking-wider">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country_address"
                      value={formData.country_address}
                      onChange={handleChange}
                      className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-mars-primary/50"
                      placeholder="France"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-gray-400 uppercase tracking-wider">
                    How did you hear about us?
                  </label>
                  <input
                    type="text"
                    name="acquisition_source"
                    value={formData.acquisition_source}
                    onChange={handleChange}
                    className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-mars-primary/50"
                    placeholder="e.g., Social media, Friend, Newsletter..."
                  />
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl border border-white/10 bg-black/20">
                  <input
                    type="checkbox"
                    name="rights_accepted"
                    checked={formData.rights_accepted}
                    onChange={handleChange}
                    className="mt-1 w-5 h-5 rounded accent-mars-primary cursor-pointer"
                    required
                  />
                  <label className="text-sm text-white/80 cursor-pointer select-none">
                    I accept the <span className="text-mars-primary">terms and conditions</span> and
                    grant MarsAI the rights to screen my film during the festival. *
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-6 py-3 rounded-xl border border-white/10 bg-white/5 text-sm font-semibold uppercase tracking-wider hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!validateStep(currentStep)}
                className="px-8 py-3 rounded-xl bg-mars-gradient text-sm font-bold uppercase tracking-wider hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-mars-primary/20"
              >
                Next Step
              </button>
            ) : (
              <button
                type="submit"
                disabled={status === 'loading' || !validateStep(3)}
                className="px-8 py-3 rounded-xl bg-white text-black text-sm font-bold uppercase tracking-wider hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {status === 'loading' ? 'Submitting...' : 'Submit Film'}
              </button>
            )}
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

export default FromVideo;
