import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from "react-google-recaptcha";
import validateRecaptcha from '../../../../shared/validators/recaptcha.validator.js';
import { submitCompleteForm } from '../../services/api.service.js';
import { newsletterService } from '../../services/newsletterService.js';

const ParticipationVideoUpload = ({setEtape, formData, setFormData: setFormDataProp, allFormData}) => {
  const navigate = useNavigate();

  // États locaux pour les previews (URLs temporaires)
  const [previews, setPreviews] = useState({
    coverImage: null,
    still1: null,
    still2: null,
    still3: null,
  });

  // États locaux pour les loaders
  const [loading, setLoading] = useState({
    coverImage: false,
    still1: false,
    still2: false,
    still3: false,
  });

  // États locaux pour les erreurs
  const [errors, setErrors] = useState({
    coverImage: null,
    still1: null,
    still2: null,
    still3: null,
    videoFile: null,
    subtitle: null,
    recaptcha: null,
  });

  // État pour la durée de la vidéo
  const [videoDuration, setVideoDuration] = useState(null);

  // État pour le token reCAPTCHA
  const [recaptchaToken, setRecaptchaToken] = useState(null);

  // Référence pour le composant reCAPTCHA
  const captchaRef = useRef(null);

  // État pour la soumission du formulaire
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  /**
   * Validation d'un fichier image
   */
  const validateImage = (file, fieldName) => {
    // Vérifier le type - accepter uniquement JPG/JPEG/PNG
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      return 'Please select a JPG or PNG image only';
    }

    // Vérifier la taille
    const maxSize = fieldName === 'coverImage' ? 15 * 1024 * 1024 : 7 * 1024 * 1024; // 15MB pour cover, 7MB pour stills
    if (file.size > maxSize) {
      const maxSizeMB = fieldName === 'coverImage' ? 15 : 7;
      return `File too large. Max: ${maxSizeMB}MB`;
    }

    return null; // Valide
  };

  /**
   * Validation d'un fichier vidéo
   */
  const validateVideo = (file) => {
    // Vérifier l'extension
    const allowedExtensions = ['.mov', '.mpeg4', '.mp4', '.webm', '.mkv'];
    const fileName = file.name.toLowerCase();
    const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
    
    if (!hasValidExtension) {
      return 'Please select a valid video file (MOV, MPEG4, MP4, WebM, MKV)';
    }

    // Vérifier le type MIME
    const allowedMimeTypes = [
      'video/quicktime',      // .mov
      'video/mp4',            // .mp4
      'video/x-matroska',     // .mkv
      'video/webm',           // .webm
      'video/mov',            // tolérance backend
      'application/octet-stream' // certains navigateurs
    ];
    
    if (file.type && !allowedMimeTypes.includes(file.type)) {
      return 'Video file type not allowed';
    }

    // Vérifier la taille (max 200MB pour une vidéo)
    const maxSize = 200 * 1024 * 1024; // 200MB
    if (file.size > maxSize) {
      return 'Video file too large. Maximum: 200MB';
    }

    return null; // Valide
  };

  /**
   * Validation d'un fichier sous-titre
   */
  const validateSubtitle = (file) => {
    // Vérifier l'extension
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.srt')) {
      return 'Please select a .srt file only';
    }

    // Vérifier le type MIME (peut être text/plain ou application/x-subrip)
    const allowedMimeTypes = ['text/plain', 'application/srt', 'application/x-subrip', 'application/octet-stream'];
    if (file.type && !allowedMimeTypes.includes(file.type)) {
      return 'Subtitle file type not allowed';
    }

    // Vérifier la taille (max 1MB pour un fichier de sous-titres)
    const maxSize = 1 * 1024 * 1024; // 1MB
    if (file.size > maxSize) {
      return 'Subtitle file too large. Maximum: 1MB';
    }

    return null; // Valide
  };

  /**
   * Gestion de la sélection de fichier image
   */
  const handleImageChange = (e, fieldName) => {
    const file = e.target.files[0];
    
    if (!file) return;

    // Révoquer l'ancienne URL si elle existe
    if (previews[fieldName]) {
      URL.revokeObjectURL(previews[fieldName]);
    }

    // Valider le fichier
    const error = validateImage(file, fieldName);
    
    if (error) {
      // Afficher l'erreur
      setErrors(prev => ({ ...prev, [fieldName]: error }));
      setPreviews(prev => ({ ...prev, [fieldName]: null }));
      setFormDataProp({ ...formData, [fieldName]: null });
      return;
    }

    // Fichier valide
    setErrors(prev => ({ ...prev, [fieldName]: null }));
    setLoading(prev => ({ ...prev, [fieldName]: true }));

    // Créer URL de preview
    const objectUrl = URL.createObjectURL(file);
    
    // Simuler un léger délai pour montrer le loader (optionnel)
    setTimeout(() => {
      setPreviews(prev => ({ ...prev, [fieldName]: objectUrl }));
      setLoading(prev => ({ ...prev, [fieldName]: false }));
    }, 200);

    // Stocker le fichier dans formData
    setFormDataProp({ ...formData, [fieldName]: file });
  };

  /**
   * Suppression d'une image
   */
  const handleRemoveImage = (fieldName) => {
    // Révoquer l'URL de preview
    if (previews[fieldName]) {
      URL.revokeObjectURL(previews[fieldName]);
    }
    
    // Réinitialiser les états
    setPreviews(prev => ({ ...prev, [fieldName]: null }));
    setFormDataProp({ ...formData, [fieldName]: null });
    setErrors(prev => ({ ...prev, [fieldName]: null }));
    
    // Réinitialiser l'input file
    const input = document.getElementById(fieldName);
    if (input) input.value = '';
  };

  /**
   * Gestion des autres champs (non-images)
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    
    setFormDataProp({
      ...formData,
      [name]: fieldValue
    });
  };

  /**
   * Gestion des fichiers non-images (video, subtitle)
   */
  const handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];
    
    if (!file) {
      setErrors(prev => ({ ...prev, [name]: null }));
      // Réinitialiser la durée si c'est une vidéo
      if (name === 'videoFile') {
        setVideoDuration(null);
        setFormDataProp({ ...formData, [name]: null, duration: null });
      } else {
        setFormDataProp({ ...formData, [name]: null });
      }
      return;
    }

    // Valider selon le type de fichier
    let error = null;
    if (name === 'videoFile') {
      error = validateVideo(file);
    } else if (name === 'subtitle') {
      error = validateSubtitle(file);
    }

    if (error) {
      // Afficher l'erreur et ne pas sauvegarder le fichier
      setErrors(prev => ({ ...prev, [name]: error }));
      // Réinitialiser l'input
      e.target.value = '';
      // Réinitialiser la durée si c'est une vidéo
      if (name === 'videoFile') {
        setVideoDuration(null);
        setFormDataProp({ ...formData, [name]: null, duration: null });
      } else {
        setFormDataProp({ ...formData, [name]: null });
      }
      return;
    }

    // Fichier valide
    setErrors(prev => ({ ...prev, [name]: null }));
    setFormDataProp({
      ...formData,
      [name]: file
    });

    // Calculer la durée si c'est une vidéo
    if (name === 'videoFile') {
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = function() {
        window.URL.revokeObjectURL(video.src);
        const duration = video.duration;
        const durationInSeconds = Math.floor(duration);
        
        // Vérifier la durée maximale (2m30 = 150 secondes)
        const maxDuration = 150; // 2 minutes 30 secondes
        
        // Convertir la durée en format lisible
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const seconds = Math.floor(duration % 60);
        
        let formattedDuration = '';
        if (hours > 0) {
          formattedDuration = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
          formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
        
        // Si la durée dépasse le maximum
        if (duration > maxDuration) {
          setErrors(prev => ({ 
            ...prev, 
            videoFile: `Video too long (${formattedDuration}). Maximum duration: 2:30` 
          }));
          setFormDataProp({ ...formData, videoFile: null, duration: null });
          setVideoDuration(null);
          e.target.value = ''; // Réinitialiser l'input
          return;
        }
        
        // Durée valide - stocker en secondes pour la DB et en format lisible pour l'affichage
        setVideoDuration(formattedDuration);
        setFormDataProp({ ...formData, videoFile: file, duration: durationInSeconds });
      };
      
      video.onerror = function() {
        window.URL.revokeObjectURL(video.src);
        setVideoDuration('Unable to read duration');
      };
      
      video.src = URL.createObjectURL(file);
    }
  };

  /**
   * Cleanup des URLs au démontage du composant
   */
  useEffect(() => {
    return () => {
      // Révoquer toutes les URLs créées
      Object.values(previews).forEach(url => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Cleanup d'une URL spécifique quand elle change
   */
  useEffect(() => {
    const currentPreviews = previews;
    return () => {
      Object.entries(currentPreviews).forEach(([key, url]) => {
        if (url && url !== previews[key]) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [previews]);

  /**
   * Gestion de la soumission du formulaire
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Réinitialiser les états
    setSubmitError(null);
    setSubmitSuccess(false);
    
    // Récupérer le token reCAPTCHA
    const token = captchaRef.current?.getValue();
    
    // Valider le reCAPTCHA
    const recaptchaError = validateRecaptcha(token);
    if (recaptchaError) {
      setErrors(prev => ({ ...prev, recaptcha: recaptchaError }));
      return;
    }
    
    // Réinitialiser l'erreur reCAPTCHA si tout est OK
    setErrors(prev => ({ ...prev, recaptcha: null }));
    
    // Vérifier les champs obligatoires
    if (!formData.videoFile) {
      setSubmitError("Please upload a video");
      return;
    }
    
    if (!formData.coverImage) {
      setSubmitError("Please upload a cover image");
      return;
    }
    
    if (!formData.rightsAccepted) {
      setSubmitError("Please accept the rights");
      return;
    }
    
    // Démarrer la soumission
    setIsSubmitting(true);
    
    try {
      console.log("[SUBMIT] Soumission du formulaire complet...");
      console.log("[SUBMIT] Form data:", allFormData);
      
      // Envoyer toutes les données au backend
      const result = await submitCompleteForm(allFormData, token);

      // Inscription newsletter optionnelle (non bloquante pour la soumission vidéo)
      if (formData.newsletterSubscription && allFormData?.step1?.email) {
        try {
          await newsletterService.subscribe(allFormData.step1.email);
        } catch (newsletterError) {
          console.warn("Newsletter subscription warning:", newsletterError?.message || newsletterError);
        }
      }
      
      console.log("[SUBMIT] Soumission reussie!", result);
      
      // Afficher le succès
      setSubmitSuccess(true);
      
      // Réinitialiser le reCAPTCHA
      captchaRef.current?.reset();
      setRecaptchaToken(null);
      
      // Rediriger après 2 secondes
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
    } catch (error) {
      console.error("[SUBMIT ERROR] Erreur lors de la soumission:", error);
      setSubmitError(error.message || "An error occurred while submitting the form. Please try again.");
      
      // Réinitialiser le reCAPTCHA en cas d'erreur
      captchaRef.current?.reset();
      setRecaptchaToken(null);
      
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border border-white/10 bg-[#050505] rounded-xl p-2 text-center">
      <h2 className="p-2">Video Upload</h2>
      
      <div className="text-center flex flex-raw space-between justify-center gap-2">
        <div className="border rounded-full w-7 h-7">
          1
        </div>
        <div className="border rounded-full w-7 h-7">
          2
        </div>
        <div className="border rounded-full w-7 h-7 bg-purple-500">
          3
        </div>
      </div>

      <section className="FormContainer">
        <form onSubmit={handleSubmit} method="post" className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 justify-items-center m-5 gap-5">

          {/* Video Upload */}
          <div className="w-60">
            <label className="block text-sm mb-2">Upload Video (max 200MB, max duration 2m30) <span className="text-red-500">*</span></label>
            <input 
              className="bg-black/50 border rounded-xl p-2 w-60 text-sm"
              type="file"
              accept=".MOV,.MPEG4,.MP4,.WebM,.MKV"
              name="videoFile"
              id="videoFile"
              onChange={handleFileChange}
            />
            {errors.videoFile ? (
              <p className="text-red-500 text-xs mt-1">{errors.videoFile}</p>
            ) : videoDuration ? (
              <p className="text-green-400 text-xs mt-1">Duration: {videoDuration}</p>
            ) : formData.videoFile ? (
              <p className="text-gray-400 text-xs mt-1">Calculating duration...</p>
            ) : (
              <p className="text-gray-400 text-xs mt-1">Duration will be displayed here</p>
            )}
          </div>

          {/* Cover Image */}
          <div className="w-60">
            <label className="block text-sm mb-2">Cover Image (max 15MB) <span className="text-red-500">*</span></label>
            <div className="border border-gray-500 rounded-xl h-48 mb-2 flex items-center justify-center bg-black/30 overflow-hidden">
              {loading.coverImage ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                  <span className="text-gray-500 text-xs">Loading...</span>
                </div>
              ) : errors.coverImage ? (
                <div className="flex flex-col items-center gap-2 px-4 text-center">
                  <span className="text-red-500 text-xl">❌</span>
                  <span className="text-red-500 text-xs">{errors.coverImage}</span>
                </div>
              ) : previews.coverImage ? (
                <img 
                  src={previews.coverImage} 
                  alt="Cover preview" 
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-gray-500 text-xs">Preview</span>
              )}
            </div>
            <input 
              className="bg-black/50 border rounded-xl p-2 w-60 text-sm"
              type="file"
              accept="image/jpg, image/jpeg, image/png"
              name="coverImage"
              id="coverImage"
              onChange={(e) => handleImageChange(e, 'coverImage')}
            />
          </div>

          {/* Still 1 */}
          <div className="w-60">
            <label className="block text-sm mb-2">Still 1 (optional, max 7MB)</label>
            <div className="border border-gray-500 rounded-xl h-48 mb-2 flex items-center justify-center bg-black/30 overflow-hidden relative">
              {loading.still1 ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                  <span className="text-gray-500 text-xs">Loading...</span>
                </div>
              ) : errors.still1 ? (
                <div className="flex flex-col items-center gap-2 px-4 text-center">
                  <span className="text-red-500 text-xl">❌</span>
                  <span className="text-red-500 text-xs">{errors.still1}</span>
                </div>
              ) : previews.still1 ? (
                <>
                  <img 
                    src={previews.still1} 
                    alt="Still 1 preview" 
                    className="w-full h-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage('still1')}
                    className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 rounded-full p-2 transition-colors"
                    aria-label="Remove still 1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </>
              ) : (
                <span className="text-gray-500 text-xs">Preview</span>
              )}
            </div>
            <input 
              className="bg-black/50 border rounded-xl p-2 w-60 text-sm"
              type="file"
              accept="image/jpeg, image/jpg, image/png"
              name="still1"
              id="still1"
              onChange={(e) => handleImageChange(e, 'still1')}
            />
          </div>
          
          {/* Still 2 */}
          <div className="w-60">
            <label className="block text-sm mb-2">Still 2 (optional, max 7MB)</label>
            <div className="border border-gray-500 rounded-xl h-48 mb-2 flex items-center justify-center bg-black/30 overflow-hidden relative">
              {loading.still2 ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                  <span className="text-gray-500 text-xs">Loading...</span>
                </div>
              ) : errors.still2 ? (
                <div className="flex flex-col items-center gap-2 px-4 text-center">
                  <span className="text-red-500 text-xl">❌</span>
                  <span className="text-red-500 text-xs">{errors.still2}</span>
                </div>
              ) : previews.still2 ? (
                <>
                  <img 
                    src={previews.still2} 
                    alt="Still 2 preview" 
                    className="w-full h-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage('still2')}
                    className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 rounded-full p-2 transition-colors"
                    aria-label="Remove still 2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </>
              ) : (
                <span className="text-gray-500 text-xs">Preview</span>
              )}
            </div>
            <input 
              className="bg-black/50 border rounded-xl p-2 w-60 text-sm"
              type="file"
              accept="image/jpeg, image/jpg, image/png"
              name="still2"
              id="still2"
              onChange={(e) => handleImageChange(e, 'still2')}
            />
          </div>
          
          {/* Still 3 */}
          <div className="w-60">
            <label className="block text-sm mb-2">Still 3 (optional, max 7MB)</label>
            <div className="border border-gray-500 rounded-xl h-48 mb-2 flex items-center justify-center bg-black/30 overflow-hidden relative">
              {loading.still3 ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                  <span className="text-gray-500 text-xs">Loading...</span>
                </div>
              ) : errors.still3 ? (
                <div className="flex flex-col items-center gap-2 px-4 text-center">
                  <span className="text-red-500 text-xl">❌</span>
                  <span className="text-red-500 text-xs">{errors.still3}</span>
                </div>
              ) : previews.still3 ? (
                <>
                  <img 
                    src={previews.still3} 
                    alt="Still 3 preview" 
                    className="w-full h-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage('still3')}
                    className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 rounded-full p-2 transition-colors"
                    aria-label="Remove still 3"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </>
              ) : (
                <span className="text-gray-500 text-xs">Preview</span>
              )}
            </div>
            <input 
              className="bg-black/50 border rounded-xl p-2 w-60 text-sm"
              type="file"
              accept="image/jpeg, image/jpg, image/png"
              name="still3"
              id="still3"
              onChange={(e) => handleImageChange(e, 'still3')}
            />
          </div>

          {/* Subtitle Upload */}
          <div className="w-60">
            <label className="block text-sm mb-2">If there is voice or txt needing translation :
              <br />Subtitle File (.srt, max 1MB)</label>
            <input 
              className="bg-black/50 border rounded-xl p-2 w-60 text-sm"
              type="file"
              accept=".srt"
              name="subtitle"
              id="subtitle"
              onChange={handleFileChange}
            />
            {errors.subtitle && (
              <p className="text-red-500 text-xs mt-1">{errors.subtitle}</p>
            )}
          </div>

          {/* Copyright Section */}
          <div className="w-full max-w-2xl mt-4">
            <label className="flex items-center gap-2 mb-3 justify-center">
              <input 
                type="checkbox"
                name="rightsAccepted"
                id="rightsAccepted"
                checked={formData.rightsAccepted}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span className="text-sm">Rights accepted*</span>
            </label>
            <div className="border border-red-500 rounded-xl p-4 text-sm text-gray-300 bg-black/20">
              <p>
                *By submitting this video, you confirm that you hold all necessary rights to the content provided and authorize MarsAI to broadcast,
                reproduce, and use this video, in whole or in part, in its communications media, without limitation in terms of duration or territory.
              </p>
            </div>
          </div>

          {/* Newsletter Subscription */}
          <div className="w-full max-w-2xl mt-4">
            <label className="flex items-center gap-2 mb-2 justify-center cursor-pointer">
              <input 
                type="checkbox"
                name="newsletterSubscription"
                id="newsletterSubscription"
                checked={formData.newsletterSubscription || false}
                onChange={handleChange}
                className="w-4 h-4 cursor-pointer"
              />
              <span className="text-sm">Subscribe to our newsletter to stay updated on Mars AI news</span>
            </label>
            <p className="text-xs text-gray-400 text-center">
              You can unsubscribe at any time
            </p>
          </div>

          {/* reCaptcha */}
          <div className="w-auto flex flex-col items-center">
            <div className="w-[301px] h-[75.5px] overflow-hidden rounded shadow-md">
              <ReCAPTCHA 
                sitekey={import.meta.env.VITE_GOOGLE_RECAPTCHA_SITE_KEY}
                ref={captchaRef}
                onChange={(token) => setRecaptchaToken(token)}
                onExpired={() => setRecaptchaToken(null)}
                theme="dark"
              />
            </div>
            {errors.recaptcha && (
              <p className="text-red-500 text-xs mt-1">{errors.recaptcha}</p>
            )}
          </div>

          {/* Messages de succès et d'erreur */}
          {submitSuccess && (
            <div className="w-60 mx-auto mb-3 p-3 bg-green-500/20 border border-green-500 rounded-xl text-green-400 text-sm text-center">
              ✅ Your video has been successfully submitted!
              <br />
              <span className="text-xs">Redirecting...</span>
            </div>
          )}
          
          {submitError && (
            <div className="w-60 mx-auto mb-3 p-3 bg-red-500/20 border border-red-500 rounded-xl text-red-400 text-sm text-center">
              ❌ {submitError}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4 m-5 p-1 place-self-center">
            <button
              type="button"
              onClick={() => setEtape(2)}
              disabled={isSubmitting}
              className={`border rounded-xl p-2 px-8 transition-colors ${
                isSubmitting 
                  ? 'bg-gray-600 cursor-not-allowed opacity-50' 
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}>
              Back
            </button>
            <button
              type="submit"
              disabled={!recaptchaToken || isSubmitting}
              className={`border rounded-xl p-2 px-8 transition-colors ${
                recaptchaToken && !isSubmitting
                  ? 'bg-linear-to-r from-purple-700 to-pink-500 hover:from-purple-600 hover:to-pink-400' 
                  : 'bg-gray-600 cursor-not-allowed opacity-50'
              }`}>
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                'Submit'
              )}
            </button>
          </div>

        </form>
      </section>

    </div>
  );
};

export default ParticipationVideoUpload;