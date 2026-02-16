import React, { useState } from 'react';
import { validateTitle, validateTitleEN, validateLanguage, validateSynopsis, validateSynopsisEN, validateTechResume, validateCreativeResume, validateClassification, validateTags } from '../../services/formService';
import TagInput from './TagInput';

const ParticipationVideoData = ({setEtape, formData, setFormData: setFormDataProp}) => {
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const labelClass = 'block text-left text-xs text-gray-300 mb-1 ml-1';
  const fieldWrapperClass = 'w-full max-w-md';

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
    const newErrors = {
      title: validateTitle(formData.title),
      titleEN: validateTitleEN(formData.titleEN),
      language: validateLanguage(formData.language),
      synopsis: validateSynopsis(formData.synopsis),
      synopsisEN: validateSynopsisEN(formData.synopsisEN),
      techResume: validateTechResume(formData.techResume),
      creativeResume: validateCreativeResume(formData.creativeResume),
      classification: validateClassification(formData.classification),
      tags: validateTags(formData.tags),
    };

    setErrors(newErrors);

    // Retourne true si aucune erreur
    return !Object.values(newErrors).some(error => error !== null);
  };

  // Soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    if (validateForm()) {
      // Formulaire valide, passer à l'étape suivante
      setEtape(3);
    } else {
      setSubmitError('Please correct the errors before continuing');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl border border-white/10 bg-[#07070a]/95 shadow-[0_10px_60px_rgba(168,85,247,0.2)] backdrop-blur rounded-2xl p-4 sm:p-6 text-center text-white">
      <h2 className="text-2xl font-semibold tracking-tight">Video Data</h2>
      <p className="text-xs text-gray-400 mt-1">Step 2 - Describe your project</p>
      
      <div className="text-center flex justify-center gap-2 mt-4 mb-2">
        <div className="w-8 h-8 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-xs">
          1
        </div>
        <div className="w-8 h-8 rounded-full border border-fuchsia-400/60 bg-linear-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-xs font-semibold">
          2
        </div>
        <div className="w-8 h-8 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-xs">
          3
        </div>
      </div>

      <section className="FormContainer">
        <form onSubmit={handleSubmit} method="post" className="grid grid-cols-1 justify-items-center mt-6 gap-4">

          {/* Title EN */}
          <div className={fieldWrapperClass}>
            <label htmlFor="titleEN" className={labelClass}>
              Title EN <span className="text-red-500">*</span>
            </label>
            <input 
              className={getFieldClass(formData.titleEN, errors.titleEN)}
              type="text"
              name="titleEN"
              id="titleEN"
              value={formData.titleEN}
              onChange={handleChange}
              placeholder="Title EN"
            />
            {errors.titleEN && <p className="text-rose-400 text-xs mt-1 text-left">{errors.titleEN}</p>}
          </div>

          {/* Title */}
          <div className={fieldWrapperClass}>
            <label htmlFor="title" className={labelClass}>
              Title
            </label>
            <input 
              className={getFieldClass(formData.title, errors.title)}
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Title"
            />
            {errors.title && <p className="text-rose-400 text-xs mt-1 text-left">{errors.title}</p>}
          </div>

          {/* Language */}
          <div className={fieldWrapperClass}>
            <label htmlFor="language" className={labelClass}>
              Language <span className="text-red-500">*</span>
            </label>
            <input 
              className={getFieldClass(formData.language, errors.language)}
              type="text"
              name="language"
              id="language"
              value={formData.language}
              onChange={handleChange}
              placeholder="Language"
            />
            {errors.language && <p className="text-rose-400 text-xs mt-1 text-left">{errors.language}</p>}
          </div>

          {/* Synopsis EN */}
          <div className={fieldWrapperClass}>
            <label htmlFor="synopsisEN" className={labelClass}>
              Synopsis EN <span className="text-red-500">*</span>
            </label>
            <textarea 
              className={getFieldClass(formData.synopsisEN, errors.synopsisEN, true)}
              name="synopsisEN"
              id="synopsisEN"
              value={formData.synopsisEN}
              onChange={handleChange}
              placeholder="Synopsis EN"
              rows="4"
            />
            {errors.synopsisEN && <p className="text-rose-400 text-xs mt-1 text-left">{errors.synopsisEN}</p>}
          </div>

          {/* Synopsis */}
          <div className={fieldWrapperClass}>
            <label htmlFor="synopsis" className={labelClass}>
              Synopsis
            </label>
            <textarea 
              className={getFieldClass(formData.synopsis, errors.synopsis, true)}
              name="synopsis"
              id="synopsis"
              value={formData.synopsis}
              onChange={handleChange}
              placeholder="Synopsis"
              rows="4"
            />
            {errors.synopsis && <p className="text-rose-400 text-xs mt-1 text-left">{errors.synopsis}</p>}
          </div>

          {/* Tech Resume */}
          <div className={fieldWrapperClass}>
            <label htmlFor="techResume" className={labelClass}>
              Technical Resume <span className="text-red-500">*</span>
            </label>
            <textarea 
              className={getFieldClass(formData.techResume, errors.techResume, true)}
              name="techResume"
              id="techResume"
              value={formData.techResume}
              onChange={handleChange}
              placeholder="Technical Resume"
              rows="4"
            />
            {errors.techResume && <p className="text-rose-400 text-xs mt-1 text-left">{errors.techResume}</p>}
          </div>

          {/* Creative Resume */}
          <div className={fieldWrapperClass}>
            <label htmlFor="creativeResume" className={labelClass}>
              Creative Resume <span className="text-red-500">*</span>
            </label>
            <textarea 
              className={getFieldClass(formData.creativeResume, errors.creativeResume, true)}
              name="creativeResume"
              id="creativeResume"
              value={formData.creativeResume}
              onChange={handleChange}
              placeholder="Creative Resume"
              rows="4"
            />
            {errors.creativeResume && <p className="text-rose-400 text-xs mt-1 text-left">{errors.creativeResume}</p>}
          </div>

          {/* Classification */}
          <div className={fieldWrapperClass}>
            <label className={labelClass}>
              Classification <span className="text-red-500">*</span>
            </label>
            <div className={`flex items-center justify-center gap-6 p-3 rounded-xl border transition-colors ${
              formData.classification ? 'bg-[#1c1c24]' : 'bg-[#0f0f14]'
            } ${errors.classification ? 'border-rose-500' : 'border-white/15'}`}>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  className="w-4 h-4 accent-purple-500"
                  type="radio"
                  name="classification"
                  value="hybrid"
                  checked={formData.classification === 'hybrid'}
                  onChange={handleChange}
                />
                <span className="text-sm">Hybrid</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  className="w-4 h-4 accent-purple-500"
                  type="radio"
                  name="classification"
                  value="ia"
                  checked={formData.classification === 'ia'}
                  onChange={handleChange}
                />
                <span className="text-sm">Full AI</span>
              </label>
            </div>
            {errors.classification && <p className="text-rose-400 text-xs mt-1 text-left">{errors.classification}</p>}
          </div>

          {/* Tags */}
          <div className={fieldWrapperClass}>
            <label className={labelClass}>
              Tags
            </label>
            <TagInput
              value={formData.tags}
              onChange={handleTagsChange}
              error={errors.tags}
            />
          </div>

          {/* Message d'erreur général */}
          {submitError && (
            <div className="w-full max-w-md text-rose-400 text-xs text-center">
              {submitError}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 mt-4 p-1 place-self-center">
            <button 
              type="button"
              onClick={() => setEtape(1)}
              className="bg-white/5 hover:bg-white/10 border border-white/15 rounded-xl px-7 py-2.5 transition-colors text-sm font-medium">
              Back
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="bg-linear-to-r from-violet-600 to-fuchsia-600 border border-white/10 rounded-xl px-7 py-2.5 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-violet-500 hover:to-fuchsia-500 shadow-[0_8px_24px_rgba(168,85,247,0.35)] transition-all">
              {isSubmitting ? 'Loading...' : 'Next'}
            </button>
          </div>

        </form>
      </section>

    </div>
  );
};

export default ParticipationVideoData;