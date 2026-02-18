import React, { useState } from 'react';
import { validateTitle, validateTitleEN, validateLanguage, validateSynopsis, validateSynopsisEN, validateTechResume, validateCreativeResume, validateClassification, validateTags } from '../../services/formService';
import { normalizeText } from '../../../../shared/validators/video.rules.js';
import TagInput from './TagInput';
import {
  SectionHeading, labelClass, inputClass, inputBg, inputStyle,
  textareaClass, textareaStyle, errorClass,
  primaryButtonClass, primaryButtonStyle, secondaryButtonClass, secondaryButtonStyle,
} from './formStyles';

const ParticipationVideoData = ({setEtape, formData, setFormData: setFormDataProp}) => {
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const labelClass = 'block text-left text-xs text-gray-300 mb-1 ml-1';
  const fieldWrapperClass = 'w-full max-w-md';
  const normalizableFields = new Set([
    'title',
    'titleEN',
    'language',
    'synopsis',
    'synopsisEN',
    'techResume',
    'creativeResume',
  ]);

  // Fonction pour générer les classes dynamiques (fond change si rempli)
  const getFieldClass = (value, hasError, isTextarea = false) => {
    const isFilled = value && String(value).trim() !== '';
    // Changement de couleur de fond : #0f0f14 (vide) -> #1c1c24 (rempli)
    const baseBg = isFilled ? 'bg-[#1c1c24]' : 'bg-[#0f0f14]';
    const borderColor = hasError ? 'border-rose-500' : 'border-white/15 focus:border-fuchsia-400/70';
    const minHeight = isTextarea ? 'min-h-28' : '';
    
    return `${baseBg} border rounded-xl px-3 py-2.5 w-full text-sm text-white transition-colors ${borderColor} ${minHeight}`;
  };

  // Gestion des changements de champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormDataProp({
      ...formData,
      [name]: value
    });

    // Validation en temps réel
    validateField(name, value);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    if (!normalizableFields.has(name)) {
      return;
    }

    const normalizedValue = normalizeText(value);

    if (normalizedValue !== value) {
      setFormDataProp({
        ...formData,
        [name]: normalizedValue
      });
    }

    validateField(name, normalizedValue);
  };

  // Gestion spécifique des tags
  const handleTagsChange = (tagsArray) => {
    setFormDataProp({
      ...formData,
      tags: tagsArray
    });

    // Validation en temps réel
    validateField('tags', tagsArray);
  };

  // Validation d'un champ spécifique
  const validateField = (fieldName, value) => {
    let error = null;

    switch(fieldName) {
      case 'title':
        error = validateTitle(value);
        break;
      case 'titleEN':
        error = validateTitleEN(value);
        break;
      case 'language':
        error = validateLanguage(value);
        break;
      case 'synopsis':
        error = validateSynopsis(value);
        break;
      case 'synopsisEN':
        error = validateSynopsisEN(value);
        break;
      case 'techResume':
        error = validateTechResume(value);
        break;
      case 'creativeResume':
        error = validateCreativeResume(value);
        break;
      case 'classification':
        error = validateClassification(value);
        break;
      case 'tags':
        error = validateTags(value);
        break;
      default:
        break;
    }

    setErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
  };

  // Validation complète du formulaire
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
      tags: Array.isArray(formData.tags) ? formData.tags.map((tag) => normalizeText(tag).toLowerCase()) : [],
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

    // Retourne true si aucune erreur
    return {
      isValid: !Object.values(newErrors).some(error => error !== null),
      normalizedData,
    };
  };

  // Soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    const { isValid, normalizedData } = validateForm();

    if (isValid) {
      setFormDataProp(normalizedData);
      // Formulaire valide, passer à l'étape suivante
      setEtape(3);
    } else {
      setSubmitError('Please correct the errors before continuing');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} method="post" className="space-y-16">

      {/* ── Section 1: Identité de l'œuvre ── */}
      <div className="space-y-8">
        <SectionHeading>Identité de l'œuvre</SectionHeading>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="titleEN" className={labelClass}>Titre EN <span className="text-rose-500">*</span></label>
            <input
              className={`${inputBg} ${inputClass(errors.titleEN)}`} style={inputStyle}
              type="text" name="titleEN" id="titleEN"
              value={formData.titleEN} onChange={handleChange} onBlur={handleBlur}
              placeholder="TITLE IN ENGLISH..."
            />
            {errors.titleEN && <p className={errorClass}>{errors.titleEN}</p>}
          </div>
          <div>
            <label htmlFor="title" className={labelClass}>Titre original</label>
            <input
              className={`${inputBg} ${inputClass(errors.title)}`} style={inputStyle}
              type="text" name="title" id="title"
              value={formData.title} onChange={handleChange} onBlur={handleBlur}
              placeholder="NOM DE VOTRE ŒUVRE..."
            />
            {errors.title && <p className={errorClass}>{errors.title}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="language" className={labelClass}>Langue <span className="text-rose-500">*</span></label>
          <input
            className={`${inputBg} ${inputClass(errors.language)}`} style={inputStyle}
            type="text" name="language" id="language"
            value={formData.language} onChange={handleChange} onBlur={handleBlur}
            placeholder="EX : FRANÇAIS, ANGLAIS..."
          />
          {errors.language && <p className={errorClass}>{errors.language}</p>}
        </div>

        {/* Classification */}
        <div>
          <label className={labelClass}>Classification <span className="text-rose-500">*</span></label>
          <div
            className={`flex items-center gap-8 h-[66px] px-8 bg-white/[0.03] border transition-colors ${errors.classification ? 'border-rose-500' : 'border-white/10'}`}
            style={inputStyle}
          >
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="radio" name="classification" value="hybrid"
                checked={formData.classification === 'hybrid'} onChange={handleChange}
                className="w-4 h-4 accent-[#51A2FF]" />
              <span className="text-sm font-medium text-white/70">Hybride</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="radio" name="classification" value="ia"
                checked={formData.classification === 'ia'} onChange={handleChange}
                className="w-4 h-4 accent-[#51A2FF]" />
              <span className="text-sm font-medium text-white/70">Full IA</span>
            </label>
          </div>
          {errors.classification && <p className={errorClass}>{errors.classification}</p>}
        </div>

        {/* Tags */}
        <div>
          <label className={labelClass}>Tags</label>
          <TagInput value={formData.tags} onChange={handleTagsChange} error={errors.tags} />
        </div>
      </div>

      {/* ── Section 2: Vision Artistique ── */}
      <div className="space-y-8">
        <SectionHeading>Vision Artistique</SectionHeading>

        <div>
          <label htmlFor="synopsisEN" className={labelClass}>Synopsis EN <span className="text-rose-500">*</span></label>
          <textarea
            className={`${inputBg} ${textareaClass(errors.synopsisEN)}`} style={textareaStyle}
            name="synopsisEN" id="synopsisEN"
            value={formData.synopsisEN} onChange={handleChange} onBlur={handleBlur}
            placeholder="SYNOPSIS IN ENGLISH..."
          />
          {errors.synopsisEN && <p className={errorClass}>{errors.synopsisEN}</p>}
        </div>

        <div>
          <label htmlFor="synopsis" className={labelClass}>Synopsis original</label>
          <textarea
            className={`${inputBg} ${textareaClass(errors.synopsis)}`} style={textareaStyle}
            name="synopsis" id="synopsis"
            value={formData.synopsis} onChange={handleChange} onBlur={handleBlur}
            placeholder="DÉCRIVEZ VOTRE HISTOIRE..."
          />
          {errors.synopsis && <p className={errorClass}>{errors.synopsis}</p>}
        </div>

        <div>
          <label htmlFor="techResume" className={labelClass}>Résumé technique <span className="text-rose-500">*</span></label>
          <textarea
            className={`${inputBg} ${textareaClass(errors.techResume)}`} style={textareaStyle}
            name="techResume" id="techResume"
            value={formData.techResume} onChange={handleChange} onBlur={handleBlur}
            placeholder="OUTILS, MODÈLES ET PIPELINE TECHNIQUE UTILISÉS..."
          />
          {errors.techResume && <p className={errorClass}>{errors.techResume}</p>}
        </div>

        <div>
          <label htmlFor="creativeResume" className={labelClass}>Manifeste créatif <span className="text-rose-500">*</span></label>
          <textarea
            className={`${inputBg} ${textareaClass(errors.creativeResume)}`} style={textareaStyle}
            name="creativeResume" id="creativeResume"
            value={formData.creativeResume} onChange={handleChange} onBlur={handleBlur}
            placeholder="DÉCRIVEZ VOTRE VISION ET LE MESSAGE DE L'ŒUVRE..."
          />
          {errors.creativeResume && <p className={errorClass}>{errors.creativeResume}</p>}
        </div>
      </div>

      {submitError && <p className="text-rose-400 text-sm text-center">{submitError}</p>}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button type="button" onClick={() => setEtape(1)}
          className={secondaryButtonClass} style={secondaryButtonStyle}>
          Retour
        </button>
        <button type="submit" disabled={isSubmitting}
          className={`flex-1 ${primaryButtonClass(isSubmitting)}`} style={primaryButtonStyle}>
          {isSubmitting ? 'Chargement...' : 'Étape suivante'}
        </button>
      </div>

    </form>
  );
};

export default ParticipationVideoData;