import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreatableSelect from 'react-select/creatable';

// ─── Shared micro-components ─────────────────────────────────────────────────

const UploadIcon = () => (
  <svg className="w-5 h-5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
);

const SectionHeader = ({ children }) => (
  <div className="flex items-center gap-3 mb-5">
    <div
      className="h-4 w-px rounded-full flex-shrink-0"
      style={{ background: 'linear-gradient(to bottom, #8B5CF6, #EC4899)' }}
    />
    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">
      {children}
    </span>
  </div>
);

const FieldLabel = ({ children, required }) => (
  <div className="text-[10px] text-white/35 uppercase tracking-[0.2em] font-semibold mb-2">
    {children}
    {required && <span className="text-mars-primary ml-1">*</span>}
  </div>
);

const inputClass =
  'w-full rounded-xl bg-black/50 border border-white/[0.08] px-4 py-3 text-sm text-white ' +
  'placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-mars-primary/25 ' +
  'focus:border-mars-primary/40 transition-all duration-200';

const textareaClass = inputClass + ' resize-none';

const sectionDivider = <div className="h-px bg-white/[0.05]" />;

// Custom drop-zone file input
const FileZone = ({ id, name, accept, multiple, value, onChange, label, hint }) => (
  <div>
    <FieldLabel>{label}</FieldLabel>
    <label
      htmlFor={id}
      className="flex flex-col items-center justify-center gap-2.5 p-5 rounded-2xl
        border border-dashed border-white/[0.08] bg-white/[0.02]
        hover:border-mars-primary/35 hover:bg-mars-primary/[0.03]
        transition-all duration-200 cursor-pointer group min-h-[100px]"
    >
      <div className="w-9 h-9 rounded-xl bg-white/[0.04] group-hover:bg-mars-primary/10
        flex items-center justify-center transition-colors duration-200">
        <UploadIcon />
      </div>
      <div className="text-center">
        {value ? (
          <p className="text-xs font-medium text-mars-primary">
            {Array.isArray(value)
              ? `${value.length} file${value.length > 1 ? 's' : ''} selected`
              : value.name}
          </p>
        ) : (
          <>
            <p className="text-xs text-white/40 font-medium">Click to upload</p>
            {hint && <p className="text-[10px] text-white/20 mt-0.5">{hint}</p>}
          </>
        )}
      </div>
    </label>
    <input
      id={id}
      type="file"
      name={name}
      accept={accept}
      multiple={multiple}
      onChange={onChange}
      className="hidden"
    />
  </div>
);

// ─── Steps config ─────────────────────────────────────────────────────────────

const STEPS = [
  { num: 1, label: 'Media' },
  { num: 2, label: 'Metadata' },
  { num: 3, label: 'Director' },
];

// ─── CreatableSelect dark styles (stable object) ──────────────────────────────

const selectStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: '0.75rem',
    padding: '0.2rem',
    minHeight: '48px',
    boxShadow: 'none',
    '&:hover': { borderColor: 'rgba(139,92,246,0.4)' },
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: 'rgba(8,8,8,0.98)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '0.75rem',
    overflow: 'hidden',
    backdropFilter: 'blur(24px)',
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? 'rgba(139,92,246,0.12)' : 'transparent',
    color: 'white',
    cursor: 'pointer',
    fontSize: '0.875rem',
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: 'rgba(139,92,246,0.12)',
    borderRadius: '0.5rem',
    border: '1px solid rgba(139,92,246,0.22)',
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: 'white',
    padding: '0.2rem 0.5rem',
    fontSize: '0.75rem',
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: 'rgba(255,255,255,0.4)',
    '&:hover': { backgroundColor: 'rgba(139,92,246,0.3)', color: 'white' },
  }),
  input: (base) => ({ ...base, color: 'white' }),
  placeholder: (base) => ({ ...base, color: 'rgba(255,255,255,0.2)', fontSize: '0.875rem' }),
};

// ─── Main component ───────────────────────────────────────────────────────────

const FromVideo = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [existingTags, setExistingTags] = useState([]);

  const [formData, setFormData] = useState({
    youtube_url: '',
    video_file: null,
    srt_file: null,
    cover_file: null,
    still_files: [],
    title: '',
    title_en: '',
    synopsis: '',
    synopsis_en: '',
    language: '',
    country: '',
    duration: '',
    classification: 'hybrid',
    tech_resume: '',
    creative_resume: '',
    tags: [],
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
        setFormData((prev) => ({ ...prev, [name]: Array.from(files).slice(0, 3) }));
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

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/tag`
        );
        const result = await response.json();
        if (result.success) {
          setExistingTags(result.data.map((tag) => ({ value: tag.name, label: tag.name })));
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
          formData.synopsis.length >= 10 &&
          formData.synopsis_en &&
          formData.synopsis_en.length >= 10 &&
          (formData.video_file || formData.youtube_url) &&
          formData.cover_file
        );
      case 2:
        return !!formData.classification;
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
      const formDataToSend = new FormData();

      if (formData.video_file) formDataToSend.append('video', formData.video_file);
      if (formData.cover_file) formDataToSend.append('cover', formData.cover_file);
      if (formData.srt_file) formDataToSend.append('srt', formData.srt_file);

      if (formData.still_files && formData.still_files.length > 0) {
        console.log('[SUBMIT] Ajout de', formData.still_files.length, 'stills');
        formData.still_files.forEach((file) => {
          formDataToSend.append('stills', file);
          console.log('[SUBMIT] Still ajouté:', file.name);
        });
      } else {
        console.log('[SUBMIT] Aucun still à envoyer');
      }

      const textFields = [
        'youtube_url', 'title', 'title_en', 'synopsis', 'synopsis_en',
        'language', 'country', 'duration', 'classification', 'tech_resume',
        'creative_resume', 'realisator_name', 'realisator_lastname',
        'realisator_gender', 'email', 'birthday', 'mobile_number',
        'fixe_number', 'address', 'postal_code', 'city', 'country_address',
        'acquisition_source',
      ];

      textFields.forEach((field) => {
        if (formData[field] !== null && formData[field] !== '') {
          formDataToSend.append(field, formData[field]);
        }
      });

      formDataToSend.append('rights_accepted', formData.rights_accepted.toString());

      if (formData.tags && formData.tags.length > 0) {
        const tagNames = formData.tags.map((tag) => tag.value || tag.label);
        formDataToSend.append('tags', JSON.stringify(tagNames));
        console.log('[SUBMIT] Tags envoyés:', tagNames);
      }

      console.log('[SUBMIT] Envoi de la soumission vidéo...');

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/upload/submit`,
        { method: 'POST', body: formDataToSend }
      );

      const result = await response.json();

      if (!response.ok) {
        if (result.errors && Array.isArray(result.errors)) {
          const errorMessages = result.errors.map((err) => `${err.field}: ${err.message}`).join('\n');
          throw new Error(errorMessages);
        }
        throw new Error(result.message || 'Erreur lors de la soumission');
      }

      console.log('[SUBMIT] Vidéo soumise avec succès:', result.data);
      setStatus('success');
      setMessage(`Film submitted successfully. ID: ${result.data.video_id}`);
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      console.error('[SUBMIT ERROR] Erreur soumission:', error);
      setStatus('error');
      setMessage(error.message || 'Une erreur est survenue lors de la soumission');
    }
  };

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-black text-white selection:bg-mars-primary selection:text-white overflow-x-hidden">

      {/* ── HERO HEADER ──────────────────────────────────────────────────────── */}
      <header className="relative pt-44 pb-16 px-6 flex flex-col items-center text-center overflow-hidden">
        {/* Centered glow — same treatment as HomePage */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[650px]
          bg-mars-primary/8 blur-[160px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
            border border-white/10 bg-white/5 mb-8 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-white/60 font-bold">
              Open Submissions — 2026
            </span>
          </div>

          {/* Heading — mirrors HomePage h1 style */}
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter italic uppercase
            leading-[0.85] mb-5">
            Submit <span className="mars-text-gradient">Your Film</span>
          </h1>

          <p className="text-lg md:text-xl text-white/35 font-light max-w-lg">
            Share your AI-powered creative vision with our international jury
          </p>
        </div>
      </header>

      {/* ── MAIN ─────────────────────────────────────────────────────────────── */}
      <main className="relative z-10 max-w-3xl mx-auto px-6 pb-28">

        {/* ── STEPPER ──────────────────────────────────────────────────────── */}
        <div className="flex items-start justify-center mb-10">
          {STEPS.map((step, i) => (
            <React.Fragment key={step.num}>
              {/* Circle + label */}
              <div className="flex flex-col items-center gap-2.5 min-w-[72px]">
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2
                  font-bold text-sm transition-all duration-300
                  ${currentStep === step.num
                    ? 'border-mars-primary bg-mars-primary text-white scale-110 shadow-lg shadow-mars-primary/35'
                    : currentStep > step.num
                    ? 'border-mars-primary/50 bg-mars-primary/10 text-mars-primary'
                    : 'border-white/[0.08] bg-white/[0.03] text-white/25'}
                `}>
                  {currentStep > step.num ? <CheckIcon /> : step.num}
                </div>
                <span className={`text-[9px] uppercase tracking-[0.2em] font-bold
                  transition-colors duration-300 text-center leading-tight
                  ${currentStep === step.num
                    ? 'text-white'
                    : currentStep > step.num
                    ? 'text-mars-primary/60'
                    : 'text-white/20'}`}>
                  {step.label}
                </span>
              </div>

              {/* Connector */}
              {i < STEPS.length - 1 && (
                <div className="flex-1 flex items-center pt-5 px-3">
                  <div className={`h-px w-full transition-all duration-500
                    ${currentStep > step.num ? 'bg-mars-primary/35' : 'bg-white/[0.06]'}`}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* ── FORM ─────────────────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit}>

          {/* Glass card */}
          <div className="glass-card rounded-3xl p-8 md:p-10 space-y-8 mb-5">

            {/* ── STEP 1 : Media & Content ─────────────────────────────────── */}
            {currentStep === 1 && (
              <div className="space-y-8 animate-fade-in">

                {/* Video Source */}
                <section>
                  <SectionHeader>Video Source</SectionHeader>
                  <div className="space-y-4">
                    <div>
                      <FieldLabel>YouTube URL</FieldLabel>
                      <input
                        type="url"
                        name="youtube_url"
                        value={formData.youtube_url}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="https://youtube.com/watch?v=..."
                      />
                    </div>
                    <FileZone
                      id="video_file_input"
                      name="video_file"
                      accept="video/*"
                      value={formData.video_file}
                      onChange={handleChange}
                      label="Or upload video file"
                      hint="MP4, MOV, AVI — up to 2 GB"
                    />
                  </div>
                </section>

                {sectionDivider}

                {/* Visuals */}
                <section>
                  <SectionHeader>Visuals</SectionHeader>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FileZone
                      id="cover_file_input"
                      name="cover_file"
                      accept="image/*"
                      value={formData.cover_file}
                      onChange={handleChange}
                      label="Cover Image *"
                      hint="JPG, PNG, WEBP"
                    />
                    <FileZone
                      id="still_files_input"
                      name="still_files"
                      accept="image/*"
                      multiple
                      value={formData.still_files.length > 0 ? formData.still_files : null}
                      onChange={handleChange}
                      label="Film Stills (max 3)"
                      hint="Gallery images"
                    />
                    <FileZone
                      id="srt_file_input"
                      name="srt_file"
                      accept=".srt"
                      value={formData.srt_file}
                      onChange={handleChange}
                      label="Subtitles (SRT)"
                      hint=".srt file"
                    />
                  </div>
                </section>

                {sectionDivider}

                {/* Film Details */}
                <section>
                  <SectionHeader>Film Details</SectionHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <FieldLabel required>Title</FieldLabel>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          className={inputClass}
                          placeholder="Film title"
                          required
                        />
                      </div>
                      <div>
                        <FieldLabel>Title (English)</FieldLabel>
                        <input
                          type="text"
                          name="title_en"
                          value={formData.title_en}
                          onChange={handleChange}
                          className={inputClass}
                          placeholder="English title"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <FieldLabel required>Synopsis</FieldLabel>
                        <textarea
                          name="synopsis"
                          value={formData.synopsis}
                          onChange={handleChange}
                          rows={4}
                          className={textareaClass}
                          placeholder="Describe your film… (min. 10 characters)"
                        />
                        <p className={`text-[10px] mt-1.5 tabular-nums ${
                          formData.synopsis.length >= 10
                            ? 'text-green-400'
                            : formData.synopsis.length > 0
                            ? 'text-orange-400'
                            : 'text-white/20'
                        }`}>
                          {formData.synopsis.length}/5000
                          {formData.synopsis.length < 10 && formData.synopsis.length > 0
                            ? ' — min. 10'
                            : ''}
                        </p>
                      </div>
                      <div>
                        <FieldLabel required>Synopsis (English)</FieldLabel>
                        <textarea
                          name="synopsis_en"
                          value={formData.synopsis_en}
                          onChange={handleChange}
                          rows={4}
                          className={textareaClass}
                          placeholder="English synopsis… (min. 10 characters)"
                        />
                        <p className={`text-[10px] mt-1.5 tabular-nums ${
                          formData.synopsis_en.length >= 10
                            ? 'text-green-400'
                            : formData.synopsis_en.length > 0
                            ? 'text-orange-400'
                            : 'text-white/20'
                        }`}>
                          {formData.synopsis_en.length}/5000
                          {formData.synopsis_en.length < 10 && formData.synopsis_en.length > 0
                            ? ' — min. 10'
                            : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

              </div>
            )}

            {/* ── STEP 2 : Metadata & Classification ───────────────────────── */}
            {currentStep === 2 && (
              <div className="space-y-8 animate-fade-in">

                {/* Technical Info */}
                <section>
                  <SectionHeader>Technical Info</SectionHeader>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <FieldLabel>Language</FieldLabel>
                      <input
                        type="text"
                        name="language"
                        value={formData.language}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="e.g. French"
                      />
                    </div>
                    <div>
                      <FieldLabel>Country</FieldLabel>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="e.g. France"
                      />
                    </div>
                    <div>
                      <FieldLabel>Duration (s)</FieldLabel>
                      <input
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="e.g. 120"
                      />
                    </div>
                  </div>
                </section>

                {sectionDivider}

                {/* AI Classification */}
                <section>
                  <SectionHeader>AI Classification *</SectionHeader>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { value: 'ia', title: 'Full AI', desc: '100% AI-generated content' },
                      { value: 'hybrid', title: 'Hybrid', desc: 'AI + Human creativity' },
                    ].map((opt) => (
                      <label
                        key={opt.value}
                        className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer
                          transition-all duration-200 ${
                          formData.classification === opt.value
                            ? 'border-mars-primary bg-mars-primary/10'
                            : 'border-white/[0.07] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.03]'
                        }`}
                      >
                        {/* Custom radio indicator */}
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                          flex-shrink-0 transition-all ${
                          formData.classification === opt.value
                            ? 'border-mars-primary'
                            : 'border-white/20'
                        }`}>
                          {formData.classification === opt.value && (
                            <div className="w-2 h-2 rounded-full bg-mars-primary" />
                          )}
                        </div>
                        <input
                          type="radio"
                          name="classification"
                          value={opt.value}
                          checked={formData.classification === opt.value}
                          onChange={handleChange}
                          className="hidden"
                        />
                        <div>
                          <p className="font-semibold text-sm text-white">{opt.title}</p>
                          <p className="text-xs text-white/35 mt-0.5">{opt.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </section>

                {sectionDivider}

                {/* Creative Notes */}
                <section>
                  <SectionHeader>Creative Notes</SectionHeader>
                  <div className="space-y-4">
                    <div>
                      <FieldLabel>Technical Resume</FieldLabel>
                      <textarea
                        name="tech_resume"
                        value={formData.tech_resume}
                        onChange={handleChange}
                        rows={4}
                        className={textareaClass}
                        placeholder="AI tools used (e.g. Midjourney, Runway, Sora…)"
                      />
                    </div>
                    <div>
                      <FieldLabel>Creative Resume</FieldLabel>
                      <textarea
                        name="creative_resume"
                        value={formData.creative_resume}
                        onChange={handleChange}
                        rows={4}
                        className={textareaClass}
                        placeholder="Describe your creative methodology…"
                      />
                    </div>
                  </div>
                </section>

                {sectionDivider}

                {/* Tags */}
                <section>
                  <SectionHeader>Tags</SectionHeader>
                  <CreatableSelect
                    isMulti
                    value={formData.tags}
                    onChange={handleTagsChange}
                    options={existingTags}
                    placeholder="Add tags (e.g. sci-fi, experimental, drama…)"
                    noOptionsMessage={() => 'Type and press Enter to create a tag'}
                    formatCreateLabel={(v) => `Create tag "${v}"`}
                    styles={selectStyles}
                  />
                  <p className="text-[10px] text-white/20 mt-2">
                    Type a tag name and press Enter to add it.
                  </p>
                </section>

              </div>
            )}

            {/* ── STEP 3 : Director Information ───────────────────────────── */}
            {currentStep === 3 && (
              <div className="space-y-8 animate-fade-in">

                {/* Identity */}
                <section>
                  <SectionHeader>Identity</SectionHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <FieldLabel required>First Name</FieldLabel>
                        <input
                          type="text"
                          name="realisator_name"
                          value={formData.realisator_name}
                          onChange={handleChange}
                          className={inputClass}
                          placeholder="John"
                          required
                        />
                      </div>
                      <div>
                        <FieldLabel required>Last Name</FieldLabel>
                        <input
                          type="text"
                          name="realisator_lastname"
                          value={formData.realisator_lastname}
                          onChange={handleChange}
                          className={inputClass}
                          placeholder="Doe"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <FieldLabel required>Gender</FieldLabel>
                        <select
                          name="realisator_gender"
                          value={formData.realisator_gender}
                          onChange={handleChange}
                          className={`${inputClass} [&>option]:bg-black`}
                        >
                          <option value="">Select…</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                          <option value="prefer-not">Prefer not to say</option>
                        </select>
                      </div>
                      <div>
                        <FieldLabel>Birthday</FieldLabel>
                        <input
                          type="date"
                          name="birthday"
                          value={formData.birthday}
                          onChange={handleChange}
                          style={{ colorScheme: 'dark' }}
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {sectionDivider}

                {/* Contact */}
                <section>
                  <SectionHeader>Contact</SectionHeader>
                  <div className="space-y-4">
                    <div>
                      <FieldLabel required>Email</FieldLabel>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="director@example.com"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <FieldLabel>Mobile</FieldLabel>
                        <input
                          type="tel"
                          name="mobile_number"
                          value={formData.mobile_number}
                          onChange={handleChange}
                          className={inputClass}
                          placeholder="+33 6 12 34 56 78"
                        />
                      </div>
                      <div>
                        <FieldLabel>Landline</FieldLabel>
                        <input
                          type="tel"
                          name="fixe_number"
                          value={formData.fixe_number}
                          onChange={handleChange}
                          className={inputClass}
                          placeholder="+33 1 23 45 67 89"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {sectionDivider}

                {/* Address */}
                <section>
                  <SectionHeader>Address</SectionHeader>
                  <div className="space-y-4">
                    <div>
                      <FieldLabel>Street</FieldLabel>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="123 Main Street, Apt 4B"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <FieldLabel>Postal Code</FieldLabel>
                        <input
                          type="text"
                          name="postal_code"
                          value={formData.postal_code}
                          onChange={handleChange}
                          className={inputClass}
                          placeholder="75001"
                        />
                      </div>
                      <div>
                        <FieldLabel>City</FieldLabel>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className={inputClass}
                          placeholder="Paris"
                        />
                      </div>
                      <div>
                        <FieldLabel>Country</FieldLabel>
                        <input
                          type="text"
                          name="country_address"
                          value={formData.country_address}
                          onChange={handleChange}
                          className={inputClass}
                          placeholder="France"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {sectionDivider}

                {/* Additional */}
                <section>
                  <SectionHeader>Additional</SectionHeader>
                  <div>
                    <FieldLabel>How did you hear about us?</FieldLabel>
                    <input
                      type="text"
                      name="acquisition_source"
                      value={formData.acquisition_source}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="e.g. Social media, Friend, Newsletter…"
                    />
                  </div>
                </section>

                {sectionDivider}

                {/* Rights — custom styled checkbox */}
                <label className={`flex items-start gap-4 p-5 rounded-2xl border cursor-pointer
                  transition-all duration-200 ${
                  formData.rights_accepted
                    ? 'border-mars-primary/40 bg-mars-primary/[0.06]'
                    : 'border-white/[0.07] bg-white/[0.02] hover:border-mars-primary/25 hover:bg-mars-primary/[0.03]'
                }`}>
                  <div className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center
                    justify-center flex-shrink-0 transition-all duration-200 ${
                    formData.rights_accepted
                      ? 'border-mars-primary bg-mars-primary'
                      : 'border-white/20'
                  }`}>
                    {formData.rights_accepted && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <input
                    type="checkbox"
                    name="rights_accepted"
                    checked={formData.rights_accepted}
                    onChange={handleChange}
                    className="hidden"
                    required
                  />
                  <p className="text-sm text-white/60 leading-relaxed">
                    I accept the{' '}
                    <span className="text-mars-primary font-medium">terms and conditions</span>
                    {' '}and grant MarsAI the rights to screen my film during the festival.{' '}
                    <span className="text-mars-primary">*</span>
                  </p>
                </label>

              </div>
            )}

          </div>

          {/* ── NAVIGATION ─────────────────────────────────────────────────── */}
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="mars-button-outline px-6 py-3 text-sm font-bold uppercase
                tracking-[0.12em] disabled:opacity-20 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!validateStep(currentStep)}
                className="mars-button-primary px-8 py-3 text-sm font-bold uppercase
                  tracking-[0.12em] disabled:opacity-25 disabled:cursor-not-allowed"
              >
                Next Step
              </button>
            ) : (
              <button
                type="submit"
                disabled={status === 'loading' || !validateStep(3)}
                className="flex items-center gap-2 px-8 py-3 rounded-full bg-white text-black
                  text-sm font-bold uppercase tracking-[0.12em]
                  hover:bg-gray-100 shadow-lg shadow-white/10
                  disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-200"
              >
                {status === 'loading' && (
                  <svg
                    className="animate-spin w-4 h-4 text-black flex-shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10"
                      stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962
                        7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                {status === 'loading' ? 'Submitting…' : 'Submit Film'}
              </button>
            )}
          </div>

          {/* ── STATUS MESSAGE ──────────────────────────────────────────────── */}
          {message && (
            <div className={`mt-4 flex items-center gap-3 p-4 rounded-2xl border text-sm
              font-medium ${
              status === 'error'
                ? 'bg-red-500/[0.07] text-red-400 border-red-500/20'
                : 'bg-green-500/[0.07] text-green-400 border-green-500/20'
            }`}>
              {status === 'success' ? (
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {message}
            </div>
          )}

        </form>
      </main>
    </div>
  );
};

export default FromVideo;
