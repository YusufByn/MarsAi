import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from "react-google-recaptcha";
import validateRecaptcha from '../../../../shared/validators/recaptcha.validator.js';
import { submitCompleteForm } from '../../services/api.service.js';
import { newsletterService } from '../../services/newsletterService.js';

// ─── Design tokens ────────────────────────────────────────────────────────────

const labelCls = 'block text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40 mb-2';
const errorCls = 'text-rose-400 text-xs mt-1.5';

const SectionHeader = ({ children }) => (
  <div className="flex items-center gap-3 mb-5">
    <div
      className="h-4 w-px rounded-full flex-shrink-0"
      style={{ background: 'linear-gradient(to bottom, #8B5CF6, #EC4899)' }}
    />
    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/35">
      {children}
    </span>
  </div>
);

const Divider = () => <div className="h-px bg-white/[0.05]" />;

// Upload icon
const UploadIcon = () => (
  <svg className="w-5 h-5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

// Film icon
const FilmIcon = () => (
  <svg className="w-5 h-5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
      d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
  </svg>
);

// Spinner
const Spinner = () => (
  <div className="flex flex-col items-center gap-2">
    <div className="animate-spin rounded-full h-7 w-7 border-2 border-mars-primary/30 border-t-mars-primary" />
    <span className="text-white/30 text-xs">Loading…</span>
  </div>
);

// Remove button
const RemoveBtn = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 hover:bg-rose-500/80
      border border-white/10 flex items-center justify-center transition-colors"
    aria-label="Remove file"
  >
    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>
);

// Image preview slot (cover or stills)
const ImageSlot = ({ label, hint, fieldName, preview, loading, error, fileInputRef, onChange, onRemove, required }) => (
  <div className="flex flex-col gap-2">
    <div className={labelCls}>
      {label} {required && <span className="text-mars-primary">*</span>}
    </div>

    {/* Preview box */}
    <div className={`relative rounded-2xl overflow-hidden border transition-all duration-200
      flex items-center justify-center bg-[#080810]
      ${error
        ? 'border-rose-500/40 h-36'
        : preview
        ? 'border-white/10 h-36'
        : 'border-dashed border-white/[0.08] h-36 hover:border-mars-primary/30 cursor-pointer group'
      }`}
      onClick={() => !preview && fileInputRef?.current && fileInputRef.current.click()}
    >
      {loading ? (
        <Spinner />
      ) : error ? (
        <div className="flex flex-col items-center gap-2 px-4 text-center">
          <svg className="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-rose-400 text-xs">{error}</span>
        </div>
      ) : preview ? (
        <>
          <img src={preview} alt={label} className="w-full h-full object-cover" />
          <RemoveBtn onClick={onRemove} />
        </>
      ) : (
        <div className="flex flex-col items-center gap-2 group-hover:scale-105 transition-transform">
          <UploadIcon />
          <p className="text-xs text-white/30">{hint || 'Click to upload'}</p>
        </div>
      )}
    </div>

    {/* File input trigger */}
    <label
      htmlFor={`file-${fieldName}`}
      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.07]
        hover:bg-white/[0.06] hover:border-white/15 text-xs text-white/40 cursor-pointer transition-all"
    >
      <UploadIcon />
      <span>{preview ? 'Change file' : 'Choose file'}</span>
    </label>
    <input
      id={`file-${fieldName}`}
      type="file"
      accept="image/jpg,image/jpeg,image/png"
      name={fieldName}
      ref={fileInputRef}
      onChange={onChange}
      className="hidden"
    />
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────

const ParticipationVideoUpload = ({ setEtape, formData, setFormData: setFormDataProp, allFormData }) => {
  const navigate = useNavigate();
  const maxVideoPreviewSeconds = 6;

  const [previews, setPreviews] = useState({ videoFile: null, coverImage: null, still1: null, still2: null, still3: null });
  const [loading, setLoading] = useState({ coverImage: false, still1: false, still2: false, still3: false });
  const [errors, setErrors] = useState({ coverImage: null, still1: null, still2: null, still3: null, videoFile: null, subtitle: null, recaptcha: null });
  const [videoDuration, setVideoDuration] = useState(null);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const captchaRef = useRef(null);
  const fileInputRefs = useRef({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateImage = (file, fieldName) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type.toLowerCase())) return 'Please select a JPG or PNG image only';
    const maxSize = fieldName === 'coverImage' ? 15 * 1024 * 1024 : 7 * 1024 * 1024;
    if (file.size > maxSize) return `File too large. Max: ${fieldName === 'coverImage' ? 15 : 7}MB`;
    return null;
  };

  const validateVideo = (file) => {
    const allowedExtensions = ['.mov', '.mpeg4', '.mp4', '.webm', '.mkv'];
    const fileName = file.name.toLowerCase();
    if (!allowedExtensions.some(ext => fileName.endsWith(ext))) return 'Please select a valid video file (MOV, MPEG4, MP4, WebM, MKV)';
    const allowedMimeTypes = ['video/quicktime', 'video/mp4', 'video/x-matroska', 'video/webm', 'video/mov', 'application/octet-stream'];
    if (file.type && !allowedMimeTypes.includes(file.type)) return 'Video file type not allowed';
    if (file.size > 200 * 1024 * 1024) return 'Video file too large. Maximum: 200MB';
    return null;
  };

  const validateSubtitle = (file) => {
    if (!file.name.toLowerCase().endsWith('.srt')) return 'Please select a .srt file only';
    const allowedMimeTypes = ['text/plain', 'application/srt', 'application/x-subrip', 'application/octet-stream'];
    if (file.type && !allowedMimeTypes.includes(file.type)) return 'Subtitle file type not allowed';
    if (file.size > 1 * 1024 * 1024) return 'Subtitle file too large. Maximum: 1MB';
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
    setFormDataProp({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleVideoPreviewTimeUpdate = (e) => {
    const v = e.currentTarget;
    if (v.currentTime >= maxVideoPreviewSeconds) { v.pause(); v.currentTime = 0; }
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
    if (name === 'videoFile') error = validateVideo(file);
    else if (name === 'subtitle') error = validateSubtitle(file);
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
      const previewUrl = URL.createObjectURL(file);
      setPreviews(prev => ({ ...prev, videoFile: previewUrl }));
      const video = document.createElement('video');
      video.preload = 'metadata';
      const metaUrl = URL.createObjectURL(file);
      video.onloadedmetadata = function () {
        window.URL.revokeObjectURL(metaUrl);
        const duration = video.duration;
        const durationInSeconds = Math.floor(duration);
        const maxDuration = 150;
        const h = Math.floor(duration / 3600);
        const m = Math.floor((duration % 3600) / 60);
        const s = Math.floor(duration % 60);
        const formatted = h > 0 ? `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}` : `${m}:${String(s).padStart(2,'0')}`;
        if (duration > maxDuration) {
          if (previewUrl) URL.revokeObjectURL(previewUrl);
          setPreviews(prev => ({ ...prev, videoFile: null }));
          setErrors(prev => ({ ...prev, videoFile: `Video too long (${formatted}). Maximum duration: 2:30` }));
          setFormDataProp({ ...formData, videoFile: null, duration: null });
          setVideoDuration(null);
          e.target.value = '';
          return;
        }
        setVideoDuration(formatted);
        setFormDataProp({ ...formData, videoFile: file, duration: durationInSeconds });
      };
      video.onerror = function () {
        window.URL.revokeObjectURL(metaUrl);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviews(prev => ({ ...prev, videoFile: null }));
        setErrors(prev => ({ ...prev, videoFile: 'Unable to read video file metadata' }));
        setFormDataProp({ ...formData, videoFile: null, duration: null });
        setVideoDuration('Unable to read duration');
      };
      video.src = metaUrl;
      return;
    }
    setFormDataProp({ ...formData, [name]: file });
  };

  useEffect(() => {
    return () => { Object.values(previews).forEach(url => { if (url) URL.revokeObjectURL(url); }); };
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
    if (recaptchaError) { setErrors(prev => ({ ...prev, recaptcha: recaptchaError })); return; }
    setErrors(prev => ({ ...prev, recaptcha: null }));
    if (!formData.videoFile) { setSubmitError("Please upload a video"); return; }
    if (!formData.coverImage) { setSubmitError("Please upload a cover image"); return; }
    if (!formData.rightsAccepted) { setSubmitError("Please accept the rights"); return; }
    if (typeof formData.duration === 'number' && formData.duration > 150) { setSubmitError("Video too long. Maximum duration: 2:30"); return; }
    setIsSubmitting(true);
    try {
      const result = await submitCompleteForm(allFormData, token);
      if (formData.newsletterSubscription && allFormData?.step1?.email) {
        try { await newsletterService.subscribe(allFormData.step1.email); }
        catch (newsletterError) { console.warn("Newsletter subscription warning:", newsletterError?.message || newsletterError); }
      }
      setSubmitSuccess(true);
      captchaRef.current?.reset();
      setRecaptchaToken(null);
      setTimeout(() => {
        navigate('/ValidatedParticipation', {
          state: { firstName: allFormData?.step1?.firstName || '', lastName: allFormData?.step1?.lastName || '' },
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

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="w-full glass-card rounded-3xl p-6 sm:p-8 text-white animate-fade-in">

      {/* Step title */}
      <div className="mb-8">
        <h2 className="text-xl font-bold tracking-tight">Video Upload</h2>
        <p className="text-xs text-white/35 mt-1 font-light">Finalize and submit your film</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* ── VIDEO FILE ───────────────────────────────────────────────────── */}
        <section>
          <SectionHeader>
            Video File <span className="text-mars-primary ml-1">*</span>
          </SectionHeader>

          {/* Drop zone */}
          <label
            htmlFor="videoFile"
            className={`flex flex-col items-center gap-3 p-8 rounded-2xl border border-dashed
              cursor-pointer transition-all duration-200
              ${errors.videoFile
                ? 'border-rose-500/40 bg-rose-500/[0.03]'
                : previews.videoFile
                ? 'border-mars-primary/30 bg-mars-primary/[0.04]'
                : 'border-white/[0.08] bg-white/[0.02] hover:border-mars-primary/30 hover:bg-mars-primary/[0.03]'
              } group`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors
              ${previews.videoFile ? 'bg-mars-primary/15' : 'bg-white/[0.04] group-hover:bg-mars-primary/10'}`}>
              <FilmIcon />
            </div>
            <div className="text-center">
              {previews.videoFile ? (
                <>
                  <p className="text-sm font-medium text-mars-primary">{formData.videoFile?.name}</p>
                  {videoDuration && (
                    <p className="text-xs text-emerald-400 mt-1">Duration: {videoDuration}</p>
                  )}
                  {!videoDuration && formData.videoFile && (
                    <p className="text-xs text-white/35 mt-1">Calculating duration…</p>
                  )}
                </>
              ) : (
                <>
                  <p className="text-sm text-white/50 font-medium">Click to upload video</p>
                  <p className="text-xs text-white/25 mt-0.5">MOV, MP4, WebM, MKV — max 200MB, max 2:30</p>
                </>
              )}
            </div>
          </label>
          <input
            id="videoFile" type="file" name="videoFile"
            accept=".MOV,.MPEG4,.MP4,.WebM,.MKV"
            onChange={handleFileChange}
            className="hidden"
          />
          {errors.videoFile && <p className={errorCls}>{errors.videoFile}</p>}

          {/* Video preview */}
          {previews.videoFile && !errors.videoFile && (
            <div className="mt-3 rounded-2xl overflow-hidden border border-white/[0.08] bg-black">
              <video
                src={previews.videoFile}
                controls muted playsInline preload="metadata"
                className="w-full h-auto max-h-56 object-contain"
                onTimeUpdate={handleVideoPreviewTimeUpdate}
              />
              <p className="text-[10px] text-white/25 px-3 py-2">
                Preview limited to {maxVideoPreviewSeconds} seconds.
              </p>
            </div>
          )}
        </section>

        <Divider />

        {/* ── COVER IMAGE ──────────────────────────────────────────────────── */}
        <section>
          <SectionHeader>Cover Image <span className="text-mars-primary ml-1">*</span></SectionHeader>
          <div className="max-w-xs">
            <ImageSlot
              label="Cover"
              hint="JPG or PNG — max 15MB"
              fieldName="coverImage"
              preview={previews.coverImage}
              loading={loading.coverImage}
              error={errors.coverImage}
              fileInputRef={{ current: fileInputRefs.current.coverImage }}
              onChange={(e) => handleImageChange(e, 'coverImage')}
              onRemove={() => handleRemoveImage('coverImage')}
              required
            />
            <input
              id="file-coverImage" type="file"
              accept="image/jpg,image/jpeg,image/png"
              name="coverImage"
              ref={(el) => { fileInputRefs.current.coverImage = el; }}
              onChange={(e) => handleImageChange(e, 'coverImage')}
              className="hidden"
            />
          </div>
        </section>

        <Divider />

        {/* ── STILLS ───────────────────────────────────────────────────────── */}
        <section>
          <SectionHeader>Film Stills (optional)</SectionHeader>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {['still1', 'still2', 'still3'].map((field, i) => (
              <div key={field}>
                <ImageSlot
                  label={`Still ${i + 1}`}
                  hint="max 7MB"
                  fieldName={field}
                  preview={previews[field]}
                  loading={loading[field]}
                  error={errors[field]}
                  fileInputRef={{ current: fileInputRefs.current[field] }}
                  onChange={(e) => handleImageChange(e, field)}
                  onRemove={() => handleRemoveImage(field)}
                />
                <input
                  id={`file-${field}`} type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  name={field}
                  ref={(el) => { fileInputRefs.current[field] = el; }}
                  onChange={(e) => handleImageChange(e, field)}
                  className="hidden"
                />
              </div>
            ))}
          </div>
        </section>

        <Divider />

        {/* ── SUBTITLE ─────────────────────────────────────────────────────── */}
        <section>
          <SectionHeader>Subtitle File</SectionHeader>
          <div className="max-w-xs">
            <label className={labelCls}>
              If voice or text needs translation — .srt (max 1MB)
            </label>
            <label
              htmlFor="subtitle"
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed
                border-white/[0.08] bg-white/[0.02] hover:border-mars-primary/30 hover:bg-mars-primary/[0.03]
                cursor-pointer transition-all text-sm text-white/40 group"
            >
              <UploadIcon />
              <span>{formData.subtitle ? formData.subtitle.name : '.srt file'}</span>
            </label>
            <input
              id="subtitle" type="file" accept=".srt"
              name="subtitle" onChange={handleFileChange}
              className="hidden"
            />
            {errors.subtitle && <p className={errorCls}>{errors.subtitle}</p>}
          </div>
        </section>

        <Divider />

        {/* ── RIGHTS & NEWSLETTER ──────────────────────────────────────────── */}
        <section>
          <SectionHeader>Rights & Preferences</SectionHeader>
          <div className="space-y-4">

            {/* Rights accepted */}
            <label className={`flex items-start gap-4 p-5 rounded-2xl border cursor-pointer
              transition-all duration-200 ${
              formData.rightsAccepted
                ? 'border-mars-primary/40 bg-mars-primary/[0.05]'
                : 'border-white/[0.07] bg-white/[0.02] hover:border-mars-primary/25'
            }`}>
              <div className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center
                flex-shrink-0 transition-all duration-200 ${
                formData.rightsAccepted ? 'border-mars-primary bg-mars-primary' : 'border-white/20'
              }`}>
                {formData.rightsAccepted && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <input
                type="checkbox" name="rightsAccepted" id="rightsAccepted"
                checked={formData.rightsAccepted} onChange={handleChange}
                className="hidden"
              />
              <div>
                <p className="text-sm font-medium text-white mb-1">
                  Rights accepted <span className="text-mars-primary">*</span>
                </p>
                <p className="text-xs text-white/40 leading-relaxed">
                  By submitting this video, you confirm that you hold all necessary rights to the content
                  provided and authorize MarsAI to broadcast, reproduce, and use this video, in whole or
                  in part, in its communications media, without limitation in terms of duration or territory.
                </p>
              </div>
            </label>

            {/* Newsletter */}
            <label className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer
              transition-all duration-200 ${
              formData.newsletterSubscription
                ? 'border-mars-primary/40 bg-mars-primary/[0.05]'
                : 'border-white/[0.07] bg-white/[0.02] hover:border-white/15'
            }`}>
              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center
                flex-shrink-0 transition-all duration-200 ${
                formData.newsletterSubscription ? 'border-mars-primary bg-mars-primary' : 'border-white/20'
              }`}>
                {formData.newsletterSubscription && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <input
                type="checkbox" name="newsletterSubscription" id="newsletterSubscription"
                checked={formData.newsletterSubscription || false} onChange={handleChange}
                className="hidden"
              />
              <div>
                <p className="text-sm font-medium text-white">Subscribe to our newsletter</p>
                <p className="text-xs text-white/35 mt-0.5">Stay updated on MarsAI news — unsubscribe anytime</p>
              </div>
            </label>

          </div>
        </section>

        <Divider />

        {/* ── reCAPTCHA ────────────────────────────────────────────────────── */}
        <section>
          <SectionHeader>Verification</SectionHeader>
          <div className="flex flex-col items-start gap-2">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <ReCAPTCHA
                sitekey={import.meta.env.VITE_GOOGLE_RECAPTCHA_SITE_KEY}
                ref={captchaRef}
                onChange={(token) => setRecaptchaToken(token)}
                onExpired={() => setRecaptchaToken(null)}
                theme="dark"
              />
            </div>
            {errors.recaptcha && <p className={errorCls}>{errors.recaptcha}</p>}
          </div>
        </section>

        {/* ── STATUS MESSAGES ──────────────────────────────────────────────── */}
        {submitSuccess && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-green-500/[0.07]
            border border-green-500/20 text-green-400 text-sm">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-medium">Your video has been successfully submitted!</p>
              <p className="text-xs text-green-400/70 mt-0.5">Redirecting…</p>
            </div>
          </div>
        )}

        {submitError && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-500/[0.07]
            border border-rose-500/20 text-rose-400 text-sm">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {submitError}
          </div>
        )}

        {/* ── NAVIGATION ───────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => setEtape(2)}
            disabled={isSubmitting}
            className="mars-button-outline px-6 py-3 text-sm font-bold uppercase
              tracking-[0.12em] disabled:opacity-20 disabled:cursor-not-allowed"
          >
            Back
          </button>

          <button
            type="submit"
            disabled={!recaptchaToken || isSubmitting}
            className="flex items-center gap-2 px-8 py-3 rounded-full bg-white text-black
              text-sm font-bold uppercase tracking-[0.12em]
              hover:bg-gray-100 shadow-lg shadow-white/10
              disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isSubmitting && (
              <svg className="animate-spin w-4 h-4 text-black flex-shrink-0"
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            {isSubmitting ? 'Submitting…' : 'Submit Film'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default ParticipationVideoUpload;
