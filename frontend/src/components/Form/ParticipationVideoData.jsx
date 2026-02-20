import React, { useState } from 'react';
import { validateTitle, validateTitleEN, validateLanguage, validateSynopsis, validateSynopsisEN, validateTechResume, validateCreativeResume, validateClassification, validateTags } from '../../services/formService';
import { normalizeText } from '../../../../shared/validators/video.rules.js';
import TagInput from './TagInput';

// ─── Design tokens ────────────────────────────────────────────────────────────

const inputBase = (value, hasError, isTextarea = false) => {
  const isFilled = value && String(value).trim() !== '';
  const bg = isFilled ? 'bg-[#0f0f1a]' : 'bg-[#080810]';
  const border = hasError
    ? 'border-rose-500/70 focus:ring-rose-500/15'
    : 'border-white/10 focus:border-[#8B5CF6]/50 focus:ring-[#8B5CF6]/15';
  const minH = isTextarea ? 'min-h-[112px]' : '';
  return `${bg} border rounded-xl px-4 py-3 w-full text-sm text-white placeholder:text-white/20 transition-all duration-200 focus:outline-none focus:ring-2 ${border} ${minH}`;
};

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

// ─── Main component ───────────────────────────────────────────────────────────

const ParticipationVideoData = ({ setEtape, formData, setFormData: setFormDataProp }) => {
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const normalizableFields = new Set([
    'title', 'titleEN', 'language', 'synopsis', 'synopsisEN', 'techResume', 'creativeResume',
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDataProp({ ...formData, [name]: value });
    validateField(name, value);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (!normalizableFields.has(name)) return;
    const normalizedValue = normalizeText(value);
    if (normalizedValue !== value) setFormDataProp({ ...formData, [name]: normalizedValue });
    validateField(name, normalizedValue);
  };

  const handleTagsChange = (tagsArray) => {
    setFormDataProp({ ...formData, tags: tagsArray });
    validateField('tags', tagsArray);
  };

  const validateField = (fieldName, value) => {
    let error = null;
    switch (fieldName) {
      case 'title': error = validateTitle(value); break;
      case 'titleEN': error = validateTitleEN(value); break;
      case 'language': error = validateLanguage(value); break;
      case 'synopsis': error = validateSynopsis(value); break;
      case 'synopsisEN': error = validateSynopsisEN(value); break;
      case 'techResume': error = validateTechResume(value); break;
      case 'creativeResume': error = validateCreativeResume(value); break;
      case 'classification': error = validateClassification(value); break;
      case 'tags': error = validateTags(value); break;
      default: break;
    }
    setErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  const validateForm = () => {
    const normalizedData = {
      ...formData,
      title: normalizeText(formData.title),
      titleEN: normalizeText(formData.titleEN),
      language: normalizeText(formData.language),
      synopsis: normalizeText(formData.synopsis),
      synopsisEN: normalizeText(formData.synopsisEN),
      techResume: normalizeText(formData.techResume),
      creativeResume: normalizeText(formData.creativeResume),
      tags: Array.isArray(formData.tags) ? formData.tags.map(tag => normalizeText(tag).toLowerCase()) : [],
    };
    const newErrors = {
      title: validateTitle(normalizedData.title),
      titleEN: validateTitleEN(normalizedData.titleEN),
      language: validateLanguage(normalizedData.language),
      synopsis: validateSynopsis(normalizedData.synopsis),
      synopsisEN: validateSynopsisEN(normalizedData.synopsisEN),
      techResume: validateTechResume(normalizedData.techResume),
      creativeResume: validateCreativeResume(normalizedData.creativeResume),
      classification: validateClassification(normalizedData.classification),
      tags: validateTags(normalizedData.tags),
    };
    setErrors(newErrors);
    return { isValid: !Object.values(newErrors).some(e => e !== null), normalizedData };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    const { isValid, normalizedData } = validateForm();
    if (isValid) {
      setFormDataProp(normalizedData);
      setEtape(3);
    } else {
      setSubmitError('Please correct the errors before continuing');
      setIsSubmitting(false);
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="w-full glass-card rounded-3xl p-6 sm:p-8 text-white animate-fade-in">

      {/* Step title */}
      <div className="mb-8">
        <h2 className="text-xl font-bold tracking-tight">Film Data</h2>
        <p className="text-xs text-white/35 mt-1 font-light">Describe your project</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* ── TITLES ───────────────────────────────────────────────────────── */}
        <section>
          <SectionHeader>Titles</SectionHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="titleEN" className={labelCls}>
                Title EN <span className="text-mars-primary">*</span>
              </label>
              <input
                className={inputBase(formData.titleEN, errors.titleEN)}
                type="text" name="titleEN" id="titleEN"
                value={formData.titleEN} onChange={handleChange} onBlur={handleBlur}
                placeholder="English title"
              />
              {errors.titleEN && <p className={errorCls}>{errors.titleEN}</p>}
            </div>
            <div>
              <label htmlFor="title" className={labelCls}>Title (original)</label>
              <input
                className={inputBase(formData.title, errors.title)}
                type="text" name="title" id="title"
                value={formData.title} onChange={handleChange} onBlur={handleBlur}
                placeholder="Original title"
              />
              {errors.title && <p className={errorCls}>{errors.title}</p>}
            </div>
          </div>
        </section>

        <Divider />

        {/* ── LANGUAGE ─────────────────────────────────────────────────────── */}
        <section>
          <SectionHeader>Language</SectionHeader>
          <div className="max-w-xs">
            <label htmlFor="language" className={labelCls}>
              Film Language <span className="text-mars-primary">*</span>
            </label>
            <input
              className={inputBase(formData.language, errors.language)}
              type="text" name="language" id="language"
              value={formData.language} onChange={handleChange} onBlur={handleBlur}
              placeholder="e.g. French, English…"
            />
            {errors.language && <p className={errorCls}>{errors.language}</p>}
          </div>
        </section>

        <Divider />

        {/* ── SYNOPSES ─────────────────────────────────────────────────────── */}
        <section>
          <SectionHeader>Synopsis</SectionHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="synopsisEN" className={labelCls}>
                Synopsis EN <span className="text-mars-primary">*</span>
              </label>
              <textarea
                className={inputBase(formData.synopsisEN, errors.synopsisEN, true)}
                name="synopsisEN" id="synopsisEN"
                value={formData.synopsisEN} onChange={handleChange} onBlur={handleBlur}
                placeholder="English synopsis…" rows={4}
              />
              {errors.synopsisEN && <p className={errorCls}>{errors.synopsisEN}</p>}
            </div>
            <div>
              <label htmlFor="synopsis" className={labelCls}>Synopsis (original)</label>
              <textarea
                className={inputBase(formData.synopsis, errors.synopsis, true)}
                name="synopsis" id="synopsis"
                value={formData.synopsis} onChange={handleChange} onBlur={handleBlur}
                placeholder="Original language synopsis…" rows={4}
              />
              {errors.synopsis && <p className={errorCls}>{errors.synopsis}</p>}
            </div>
          </div>
        </section>

        <Divider />

        {/* ── CREATIVE NOTES ────────────────────────────────────────────────── */}
        <section>
          <SectionHeader>Creative Notes</SectionHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="techResume" className={labelCls}>
                Technical Resume <span className="text-mars-primary">*</span>
              </label>
              <textarea
                className={inputBase(formData.techResume, errors.techResume, true)}
                name="techResume" id="techResume"
                value={formData.techResume} onChange={handleChange} onBlur={handleBlur}
                placeholder="AI tools used (Midjourney, Runway, Sora…)" rows={4}
              />
              {errors.techResume && <p className={errorCls}>{errors.techResume}</p>}
            </div>
            <div>
              <label htmlFor="creativeResume" className={labelCls}>
                Creative Resume <span className="text-mars-primary">*</span>
              </label>
              <textarea
                className={inputBase(formData.creativeResume, errors.creativeResume, true)}
                name="creativeResume" id="creativeResume"
                value={formData.creativeResume} onChange={handleChange} onBlur={handleBlur}
                placeholder="Your creative methodology…" rows={4}
              />
              {errors.creativeResume && <p className={errorCls}>{errors.creativeResume}</p>}
            </div>
          </div>
        </section>

        <Divider />

        {/* ── CLASSIFICATION ───────────────────────────────────────────────── */}
        <section>
          <SectionHeader>AI Classification <span className="text-mars-primary ml-1">*</span></SectionHeader>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: 'hybrid', title: 'Hybrid', desc: 'AI + Human creativity' },
              { value: 'ia', title: 'Full AI', desc: '100% AI-generated' },
            ].map((opt) => (
              <label
                key={opt.value}
                className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer
                  transition-all duration-200 ${
                  formData.classification === opt.value
                    ? 'border-mars-primary bg-mars-primary/10'
                    : errors.classification
                    ? 'border-rose-500/40 bg-rose-500/[0.03] hover:border-rose-500/60'
                    : 'border-white/[0.07] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.03]'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                  flex-shrink-0 transition-all ${
                  formData.classification === opt.value ? 'border-mars-primary' : 'border-white/20'
                }`}>
                  {formData.classification === opt.value && (
                    <div className="w-2 h-2 rounded-full bg-mars-primary" />
                  )}
                </div>
                <input
                  type="radio" name="classification" value={opt.value}
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
          {errors.classification && <p className={errorCls}>{errors.classification}</p>}
        </section>

        <Divider />

        {/* ── TAGS ─────────────────────────────────────────────────────────── */}
        <section>
          <SectionHeader>Tags</SectionHeader>
          <TagInput
            value={formData.tags}
            onChange={handleTagsChange}
            error={errors.tags}
          />
          {errors.tags && <p className={errorCls}>{errors.tags}</p>}
        </section>

        {/* ── ERROR + SUBMIT ────────────────────────────────────────────────── */}
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

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => setEtape(1)}
            className="mars-button-outline px-6 py-3 text-sm font-bold uppercase tracking-[0.12em]"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="mars-button-primary px-8 py-3 text-sm font-bold uppercase
              tracking-[0.12em] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Loading…' : 'Next Step'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default ParticipationVideoData;
