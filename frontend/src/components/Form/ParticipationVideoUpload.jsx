import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from "react-google-recaptcha";
import validateRecaptcha from '../../../../shared/validators/recaptcha.validator.js';
import { submitCompleteForm } from '../../services/api.service.js';
import { newsletterService } from '../../services/newsletterService.js';
import {
  SectionHeading, labelClass, errorClass,
  primaryButtonClass, primaryButtonStyle, secondaryButtonClass, secondaryButtonStyle,
} from './formStyles';

const ParticipationVideoUpload = ({setEtape, formData, setFormData: setFormDataProp, allFormData}) => {
  const navigate = useNavigate();
  const maxVideoPreviewSeconds = 6;

  const [previews, setPreviews] = useState({
    videoFile: null,
    coverImage: null,
    still1: null,
    still2: null,
    still3: null,
  });

  const [loading, setLoading] = useState({
    coverImage: false,
    still1: false,
    still2: false,
    still3: false,
  });

  const [errors, setErrors] = useState({
    coverImage: null,
    still1: null,
    still2: null,
    still3: null,
    videoFile: null,
    subtitle: null,
    recaptcha: null,
  });

  const [videoDuration, setVideoDuration] = useState(null);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const captchaRef = useRef(null);
  const fileInputRefs = useRef({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateImage = (file, fieldName) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      return 'Please select a JPG or PNG image only';
    }
    const maxSize = fieldName === 'coverImage' ? 15 * 1024 * 1024 : 7 * 1024 * 1024;
    if (file.size > maxSize) {
      const maxSizeMB = fieldName === 'coverImage' ? 15 : 7;
      return `File too large. Max: ${maxSizeMB}MB`;
    }
    return null;
  };

  const validateVideo = (file) => {
    const allowedExtensions = ['.mov', '.mpeg4', '.mp4', '.webm', '.mkv'];
    const fileName = file.name.toLowerCase();
    const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
    if (!hasValidExtension) {
      return 'Please select a valid video file (MOV, MPEG4, MP4, WebM, MKV)';
    }
    const allowedMimeTypes = [
      'video/quicktime', 'video/mp4', 'video/x-matroska',
      'video/webm', 'video/mov', 'application/octet-stream'
    ];
    if (file.type && !allowedMimeTypes.includes(file.type)) {
      return 'Video file type not allowed';
    }
    const maxSize = 200 * 1024 * 1024;
    if (file.size > maxSize) {
      return 'Video file too large. Maximum: 200MB';
    }
    return null;
  };

  const validateSubtitle = (file) => {
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.srt')) {
      return 'Please select a .srt file only';
    }
    const allowedMimeTypes = ['text/plain', 'application/srt', 'application/x-subrip', 'application/octet-stream'];
    if (file.type && !allowedMimeTypes.includes(file.type)) {
      return 'Subtitle file type not allowed';
    }
    const maxSize = 1 * 1024 * 1024;
    if (file.size > maxSize) {
      return 'Subtitle file too large. Maximum: 1MB';
    }
    return null;
  };

  const handleImageChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;
    if (previews[fieldName]) URL.revokeObjectURL(previews[fieldName]);
    const error = validateImage(file, fieldName);
    if (error) {
      setErrors(prev => ({ ...prev, [fieldName]: error }));
      setPreviews(prev => ({ ...prev, [fieldName]: null }));
      setFormDataProp({ ...formData, [fieldName]: null });
      return;
    }
    setErrors(prev => ({ ...prev, [fieldName]: null }));
    setLoading(prev => ({ ...prev, [fieldName]: true }));
    const objectUrl = URL.createObjectURL(file);
    setTimeout(() => {
      setPreviews(prev => ({ ...prev, [fieldName]: objectUrl }));
      setLoading(prev => ({ ...prev, [fieldName]: false }));
    }, 200);
    setFormDataProp({ ...formData, [fieldName]: file });
  };

  const handleRemoveImage = (fieldName) => {
    if (previews[fieldName]) URL.revokeObjectURL(previews[fieldName]);
    setPreviews(prev => ({ ...prev, [fieldName]: null }));
    setFormDataProp({ ...formData, [fieldName]: null });
    setErrors(prev => ({ ...prev, [fieldName]: null }));
    const input = fileInputRefs.current[fieldName];
    if (input) input.value = '';
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    setFormDataProp({ ...formData, [name]: fieldValue });
  };

  const handleVideoPreviewTimeUpdate = (e) => {
    const videoElement = e.currentTarget;
    if (videoElement.currentTime >= maxVideoPreviewSeconds) {
      videoElement.pause();
      videoElement.currentTime = 0;
    }
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];
    if (!file) {
      setErrors(prev => ({ ...prev, [name]: null }));
      if (name === 'videoFile') {
        if (previews.videoFile) URL.revokeObjectURL(previews.videoFile);
        setPreviews(prev => ({ ...prev, videoFile: null }));
        setVideoDuration(null);
        setFormDataProp({ ...formData, [name]: null, duration: null });
      } else {
        setFormDataProp({ ...formData, [name]: null });
      }
      return;
    }
    let error = null;
    if (name === 'videoFile') {
      error = validateVideo(file);
    } else if (name === 'subtitle') {
      error = validateSubtitle(file);
    }
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
      e.target.value = '';
      if (name === 'videoFile') {
        if (previews.videoFile) URL.revokeObjectURL(previews.videoFile);
        setPreviews(prev => ({ ...prev, videoFile: null }));
        setVideoDuration(null);
        setFormDataProp({ ...formData, [name]: null, duration: null });
      } else {
        setFormDataProp({ ...formData, [name]: null });
      }
      return;
    }
    setErrors(prev => ({ ...prev, [name]: null }));
    if (name === 'videoFile') {
      if (previews.videoFile) URL.revokeObjectURL(previews.videoFile);
      const previewObjectUrl = URL.createObjectURL(file);
      setPreviews(prev => ({ ...prev, videoFile: previewObjectUrl }));
      const video = document.createElement('video');
      video.preload = 'metadata';
      const metadataObjectUrl = URL.createObjectURL(file);
      video.onloadedmetadata = function() {
        window.URL.revokeObjectURL(metadataObjectUrl);
        const duration = video.duration;
        const durationInSeconds = Math.floor(duration);
        const maxDuration = 150;
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const seconds = Math.floor(duration % 60);
        let formattedDuration = hours > 0
          ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
          : `${minutes}:${seconds.toString().padStart(2, '0')}`;
        if (duration > maxDuration) {
          if (previewObjectUrl) URL.revokeObjectURL(previewObjectUrl);
          setPreviews(prev => ({ ...prev, videoFile: null }));
          setErrors(prev => ({ ...prev, videoFile: `Video too long (${formattedDuration}). Maximum duration: 2:30` }));
          setFormDataProp({ ...formData, videoFile: null, duration: null });
          setVideoDuration(null);
          e.target.value = '';
          return;
        }
        setVideoDuration(formattedDuration);
        setFormDataProp({ ...formData, videoFile: file, duration: durationInSeconds });
      };
      video.onerror = function() {
        window.URL.revokeObjectURL(metadataObjectUrl);
        if (previewObjectUrl) URL.revokeObjectURL(previewObjectUrl);
        setPreviews(prev => ({ ...prev, videoFile: null }));
        setErrors(prev => ({ ...prev, videoFile: 'Unable to read video file metadata' }));
        setFormDataProp({ ...formData, videoFile: null, duration: null });
        setVideoDuration('Unable to read duration');
      };
      video.src = metadataObjectUrl;
      return;
    }
    setFormDataProp({ ...formData, [name]: file });
  };

  useEffect(() => {
    return () => {
      Object.values(previews).forEach(url => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const currentPreviews = previews;
    return () => {
      Object.entries(currentPreviews).forEach(([key, url]) => {
        if (url && url !== previews[key]) URL.revokeObjectURL(url);
      });
    };
  }, [previews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);
    const token = captchaRef.current?.getValue();
    const recaptchaError = validateRecaptcha(token);
    if (recaptchaError) {
      setErrors(prev => ({ ...prev, recaptcha: recaptchaError }));
      return;
    }
    setErrors(prev => ({ ...prev, recaptcha: null }));
    if (!formData.videoFile) { setSubmitError("Please upload a video"); return; }
    if (!formData.coverImage) { setSubmitError("Please upload a cover image"); return; }
    if (!formData.rightsAccepted) { setSubmitError("Please accept the rights"); return; }
    if (typeof formData.duration === 'number' && formData.duration > 150) {
      setSubmitError("Video too long. Maximum duration: 2:30");
      return;
    }
    setIsSubmitting(true);
    try {
      await submitCompleteForm(allFormData, token);
      if (formData.newsletterSubscription && allFormData?.step1?.email) {
        try {
          await newsletterService.subscribe(allFormData.step1.email);
        } catch (newsletterError) {
          console.warn("Newsletter subscription warning:", newsletterError?.message || newsletterError);
        }
      }
      setSubmitSuccess(true);
      captchaRef.current?.reset();
      setRecaptchaToken(null);
      setTimeout(() => {
        navigate('/ValidatedParticipation', {
          state: {
            firstName: allFormData?.step1?.firstName || '',
            lastName: allFormData?.step1?.lastName || '',
          },
        });
      }, 2000);
    } catch (error) {
      console.error("[SUBMIT ERROR] Erreur lors de la soumission:", error);
      setSubmitError(error.message || "An error occurred while submitting the form. Please try again.");
      captchaRef.current?.reset();
      setRecaptchaToken(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Styles réutilisables pour les zones d'upload
  const uploadZoneBase = 'flex flex-col items-center justify-center cursor-pointer transition-colors bg-white/[0.03] border border-dashed';
  const uploadZoneIdle = 'border-white/10 hover:border-white/25';
  const uploadZoneError = 'border-rose-500';

  return (
    <form onSubmit={handleSubmit} method="post" className="space-y-16">

      {/* ── Section 1 : Médias ── */}
      <div className="space-y-8">
        <SectionHeading>Médias</SectionHeading>

        {/* Vidéo */}
        <div>
          <label className={labelClass}>
            Fichier Vidéo{' '}
            <span className="text-[10px] text-white/20 normal-case tracking-normal font-normal">
              (max 200MB · max 2m30)
            </span>
            {' '}<span className="text-rose-500">*</span>
          </label>

          {previews.videoFile && !errors.videoFile ? (
            <div className="w-full overflow-hidden bg-white/[0.03] border border-white/10" style={{ borderRadius: '24px' }}>
              <video
                src={previews.videoFile}
                controls
                muted
                playsInline
                preload="metadata"
                className="w-full h-auto max-h-72 object-contain"
                onTimeUpdate={handleVideoPreviewTimeUpdate}
              />
              <p className="text-[10px] text-white/20 px-6 py-3 tracking-widest uppercase">
                Aperçu limité à {maxVideoPreviewSeconds} secondes
              </p>
            </div>
          ) : (
            <label
              htmlFor="videoFile"
              className={`${uploadZoneBase} gap-3 w-full h-40 ${errors.videoFile ? uploadZoneError : uploadZoneIdle}`}
              style={{ borderRadius: '24px' }}
            >
              <svg className="w-6 h-6 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
              </svg>
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/20">
                {formData.videoFile ? 'Vidéo sélectionnée' : 'Choisir un fichier'}
              </span>
              <span className="text-[10px] text-white/15">MOV · MP4 · WebM · MKV</span>
            </label>
          )}

          {previews.videoFile && !errors.videoFile && (
            <label
              htmlFor="videoFile"
              className="mt-3 inline-flex items-center gap-2 px-4 h-9 cursor-pointer text-[10px] font-bold tracking-[0.2em] uppercase text-white/30 hover:text-white/60 transition-colors bg-white/[0.03] border border-white/10 hover:border-white/25"
              style={{ borderRadius: '12px' }}
            >
              Changer de fichier
            </label>
          )}

          <input
            type="file"
            accept=".MOV,.MPEG4,.MP4,.WebM,.MKV"
            name="videoFile"
            id="videoFile"
            className="sr-only"
            onChange={handleFileChange}
          />

          <div className="mt-2 px-1">
            {errors.videoFile ? (
              <p className={errorClass}>{errors.videoFile}</p>
            ) : videoDuration ? (
              <p className="text-emerald-400 text-xs">Durée : {videoDuration}</p>
            ) : formData.videoFile ? (
              <p className="text-white/30 text-xs">Calcul de la durée...</p>
            ) : null}
          </div>
        </div>

        {/* Image de couverture */}
        <div>
          <label className={labelClass}>
            Image de couverture{' '}
            <span className="text-[10px] text-white/20 normal-case tracking-normal font-normal">(max 15MB)</span>
            {' '}<span className="text-rose-500">*</span>
          </label>
          <label
            htmlFor="coverImage"
            className={`relative ${uploadZoneBase} gap-3 w-full h-56 overflow-hidden ${errors.coverImage ? uploadZoneError : uploadZoneIdle}`}
            style={{ borderRadius: '24px' }}
          >
            {loading.coverImage ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                <span className="text-[10px] text-white/30 tracking-widest uppercase">Chargement...</span>
              </div>
            ) : previews.coverImage ? (
              <img src={previews.coverImage} alt="Cover" className="w-full h-full object-contain" />
            ) : errors.coverImage ? (
              <span className="text-rose-400 text-[10px] tracking-widest uppercase text-center px-4">{errors.coverImage}</span>
            ) : (
              <>
                <svg className="w-6 h-6 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/20">Image de couverture</span>
                <span className="text-[10px] text-white/15">JPG · PNG</span>
              </>
            )}
          </label>
          <input
            type="file"
            accept="image/jpg, image/jpeg, image/png"
            name="coverImage"
            id="coverImage"
            className="sr-only"
            ref={(el) => { fileInputRefs.current.coverImage = el; }}
            onChange={(e) => handleImageChange(e, 'coverImage')}
          />
        </div>

        {/* Stills */}
        <div>
          <label className={`${labelClass} mb-4 block`}>
            Photogrammes{' '}
            <span className="text-[10px] text-white/20 normal-case tracking-normal font-normal">(optionnel · max 7MB)</span>
          </label>
          <div className="grid grid-cols-3 gap-4">
            {(['still1', 'still2', 'still3']).map((field, i) => (
              <div key={field}>
                <label
                  htmlFor={field}
                  className={`relative ${uploadZoneBase} gap-2 w-full aspect-video overflow-hidden ${errors[field] ? uploadZoneError : uploadZoneIdle}`}
                  style={{ borderRadius: '16px' }}
                >
                  {loading[field] ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                  ) : previews[field] ? (
                    <>
                      <img src={previews[field]} alt={`Still ${i + 1}`} className="w-full h-full object-contain" />
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleRemoveImage(field); }}
                        className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 hover:bg-rose-500/80 rounded-full flex items-center justify-center transition-colors"
                        aria-label={`Supprimer le still ${i + 1}`}
                      >
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </>
                  ) : errors[field] ? (
                    <span className="text-rose-400 text-[9px] tracking-widest uppercase text-center px-2">{errors[field]}</span>
                  ) : (
                    <>
                      <svg className="w-4 h-4 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-[9px] font-bold tracking-widest uppercase text-white/20">Still {i + 1}</span>
                    </>
                  )}
                </label>
                <input
                  type="file"
                  accept="image/jpeg, image/jpg, image/png"
                  name={field}
                  id={field}
                  className="sr-only"
                  ref={(el) => { fileInputRefs.current[field] = el; }}
                  onChange={(e) => handleImageChange(e, field)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Sous-titres */}
        <div>
          <label className={labelClass}>
            Sous-titres{' '}
            <span className="text-[10px] text-white/20 normal-case tracking-normal font-normal">
              (si voix ou texte à traduire · .srt · max 1MB)
            </span>
          </label>
          <label
            htmlFor="subtitle"
            className={`${uploadZoneBase} flex-row gap-4 w-full h-[66px] px-8 ${errors.subtitle ? uploadZoneError : uploadZoneIdle}`}
            style={{ borderRadius: '24px' }}
          >
            <svg className="w-4 h-4 text-white/20 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h6m-6 4h10M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/20">
              {formData.subtitle ? formData.subtitle.name : 'Fichier .srt'}
            </span>
          </label>
          <input type="file" accept=".srt" name="subtitle" id="subtitle" className="sr-only" onChange={handleFileChange} />
          {errors.subtitle && <p className={errorClass}>{errors.subtitle}</p>}
        </div>
      </div>

      {/* ── Section 2 : Droits & Options ── */}
      <div className="space-y-8">
        <SectionHeading>Droits & Options</SectionHeading>

        {/* Texte des droits */}
        <div className="px-8 py-6 bg-white/[0.03] border border-white/10" style={{ borderRadius: '24px' }}>
          <p className="text-sm text-white/40 leading-relaxed">
            En soumettant cette vidéo, vous confirmez détenir tous les droits nécessaires sur le contenu
            fourni et autorisez MarsAI à diffuser, reproduire et utiliser cette vidéo, en tout ou en partie,
            dans ses médias de communication, sans limitation de durée ni de territoire.
          </p>
        </div>

        {/* Droits acceptés */}
        <label className="flex items-start gap-4 cursor-pointer group">
          <input
            type="checkbox"
            name="rightsAccepted"
            id="rightsAccepted"
            checked={formData.rightsAccepted}
            onChange={handleChange}
            className="sr-only"
          />
          <div className={`shrink-0 mt-0.5 w-5 h-5 rounded border transition-colors flex items-center justify-center ${
            formData.rightsAccepted ? 'bg-white border-white' : 'border-white/20 bg-white/[0.03] group-hover:border-white/40'
          }`}>
            {formData.rightsAccepted && (
              <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
            J'accepte les droits de diffusion <span className="text-rose-500">*</span>
          </span>
        </label>

        {/* Newsletter */}
        <label className="flex items-start gap-4 cursor-pointer group">
          <input
            type="checkbox"
            name="newsletterSubscription"
            id="newsletterSubscription"
            checked={formData.newsletterSubscription || false}
            onChange={handleChange}
            className="sr-only"
          />
          <div className={`shrink-0 mt-0.5 w-5 h-5 rounded border transition-colors flex items-center justify-center ${
            formData.newsletterSubscription ? 'bg-white border-white' : 'border-white/20 bg-white/[0.03] group-hover:border-white/40'
          }`}>
            {formData.newsletterSubscription && (
              <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <div>
            <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
              S'inscrire à la newsletter Mars AI
            </span>
            <p className="text-[10px] text-white/25 mt-0.5">Vous pouvez vous désinscrire à tout moment</p>
          </div>
        </label>

        {/* reCAPTCHA */}
        <div className="flex flex-col items-start gap-2">
          <div className="rounded-2xl overflow-hidden">
            <ReCAPTCHA
              sitekey={import.meta.env.VITE_GOOGLE_RECAPTCHA_SITE_KEY}
              ref={captchaRef}
              onChange={(token) => setRecaptchaToken(token)}
              onExpired={() => setRecaptchaToken(null)}
              theme="dark"
            />
          </div>
          {errors.recaptcha && <p className={errorClass}>{errors.recaptcha}</p>}
        </div>
      </div>

      {/* Messages de statut */}
      {submitSuccess && (
        <div className="px-6 py-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm text-center" style={{ borderRadius: '16px' }}>
          Votre vidéo a été soumise avec succès !
          <br />
          <span className="text-xs text-emerald-400/60">Redirection en cours...</span>
        </div>
      )}
      {submitError && (
        <p className="text-rose-400 text-sm text-center">{submitError}</p>
      )}

      {/* Boutons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          type="button"
          onClick={() => setEtape(2)}
          disabled={isSubmitting}
          className={secondaryButtonClass}
          style={secondaryButtonStyle}
        >
          Retour
        </button>
        <button
          type="submit"
          disabled={!recaptchaToken || isSubmitting}
          className={`flex-1 ${primaryButtonClass(!recaptchaToken || isSubmitting)}`}
          style={primaryButtonStyle}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-3">
              <span className="w-4 h-4 border-2 border-black/20 border-t-black/60 rounded-full animate-spin" />
              Envoi en cours...
            </span>
          ) : 'Soumettre'}
        </button>
      </div>

    </form>
  );
};

export default ParticipationVideoUpload;
