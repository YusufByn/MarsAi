import React, { useState } from 'react';
import { validateTitle, validateLanguage, validateSynopsis, validateTechResume, validateCreativeResume, validateClassification, validateTags } from '../../services/formService';
import TagInput from './TagInput';

const ParticipationVideoData = ({setEtape, formData, setFormData: setFormDataProp}) => {
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Gestion des changements de champs
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
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
      case 'titleEN':
        error = validateTitle(value);
        break;
      case 'language':
        error = validateLanguage(value);
        break;
      case 'synopsis':
      case 'synopsisEN':
        error = validateSynopsis(value);
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
      titleEN: validateTitle(formData.titleEN),
      language: validateLanguage(formData.language),
      synopsis: validateSynopsis(formData.synopsis),
      synopsisEN: validateSynopsis(formData.synopsisEN),
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
      console.log('Form data:', formData);
      setEtape(3);
    } else {
      setSubmitError('Please correct the errors before continuing');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border border-white/10 bg-[#050505] rounded-xl p-2 text-center">
      <h2 className="p-2">Video Data</h2>
      
      <div className="text-center flex flex-raw space-between justify-center gap-2">
        <div className="border rounded-full w-7 h-7">
          1
        </div>
        <div className="border rounded-full w-7 h-7 bg-purple-500">
          2
        </div>
        <div className="border rounded-full w-7 h-7">
          3
        </div>
      </div>

      <section className="FormContainer">
        <form onSubmit={handleSubmit} method="post" className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 justify-items-center m-5 gap-5">

          {/* Title */}
          <div className="w-60">
            <input 
              className={`bg-black/50 border rounded-xl p-2 w-60 ${errors.title ? 'border-red-500' : ''}`}
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Title"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Title EN */}
          <div className="w-60">
            <input 
              className={`bg-black/50 border rounded-xl p-2 w-60 ${errors.titleEN ? 'border-red-500' : ''}`}
              type="text"
              name="titleEN"
              id="titleEN"
              value={formData.titleEN}
              onChange={handleChange}
              placeholder="Title EN"
            />
            {errors.titleEN && <p className="text-red-500 text-sm mt-1">{errors.titleEN}</p>}
          </div>

          {/* Language */}
          <div className="w-60">
            <input 
              className={`bg-black/50 border rounded-xl p-2 w-60 ${errors.language ? 'border-red-500' : ''}`}
              type="text"
              name="language"
              id="language"
              value={formData.language}
              onChange={handleChange}
              placeholder="Language"
            />
            {errors.language && <p className="text-red-500 text-sm mt-1">{errors.language}</p>}
          </div>

          {/* Synopsis */}
          <div className="w-60">
            <textarea 
              className={`bg-black/50 border rounded-xl p-2 w-60 min-h-24 ${errors.synopsis ? 'border-red-500' : ''}`}
              name="synopsis"
              id="synopsis"
              value={formData.synopsis}
              onChange={handleChange}
              placeholder="Synopsis"
              rows="4"
            />
            {errors.synopsis && <p className="text-red-500 text-sm mt-1">{errors.synopsis}</p>}
          </div>

          {/* Synopsis EN */}
          <div className="w-60">
            <textarea 
              className={`bg-black/50 border rounded-xl p-2 w-60 min-h-24 ${errors.synopsisEN ? 'border-red-500' : ''}`}
              name="synopsisEN"
              id="synopsisEN"
              value={formData.synopsisEN}
              onChange={handleChange}
              placeholder="Synopsis EN"
              rows="4"
            />
            {errors.synopsisEN && <p className="text-red-500 text-sm mt-1">{errors.synopsisEN}</p>}
          </div>

          {/* Tech Resume */}
          <div className="w-60">
            <textarea 
              className={`bg-black/50 border rounded-xl p-2 w-60 min-h-24 ${errors.techResume ? 'border-red-500' : ''}`}
              name="techResume"
              id="techResume"
              value={formData.techResume}
              onChange={handleChange}
              placeholder="Technical Resume"
              rows="4"
            />
            {errors.techResume && <p className="text-red-500 text-sm mt-1">{errors.techResume}</p>}
          </div>

          {/* Creative Resume */}
          <div className="w-60">
            <textarea 
              className={`bg-black/50 border rounded-xl p-2 w-60 min-h-24 ${errors.creativeResume ? 'border-red-500' : ''}`}
              name="creativeResume"
              id="creativeResume"
              value={formData.creativeResume}
              onChange={handleChange}
              placeholder="Creative Resume"
              rows="4"
            />
            {errors.creativeResume && <p className="text-red-500 text-sm mt-1">{errors.creativeResume}</p>}
          </div>

          {/* Classification */}
          <div className="w-60">
            <div className="flex items-center justify-center gap-6 p-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  className="w-4 h-4"
                  type="radio"
                  name="classification"
                  value="hybrid"
                  checked={formData.classification === 'hybrid'}
                  onChange={handleChange}
                />
                <span>Hybrid</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  className="w-4 h-4"
                  type="radio"
                  name="classification"
                  value="full_ai"
                  checked={formData.classification === 'full_ai'}
                  onChange={handleChange}
                />
                <span>Full AI</span>
              </label>
            </div>
            {errors.classification && <p className="text-red-500 text-sm mt-1">{errors.classification}</p>}
          </div>

          {/* Tags */}
          <TagInput
            value={formData.tags}
            onChange={handleTagsChange}
            error={errors.tags}
          />

          {/* Message d'erreur général */}
          {submitError && (
            <div className="w-60 text-red-500 text-center">
              {submitError}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4 m-5 p-1 place-self-centered">
            <button 
              type="button"
              onClick={() => setEtape(1)}
              className="bg-gray-700 hover:bg-gray-600 border rounded-xl p-2 px-8 transition-colors">
              Back
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="bg-linear-to-r from-purple-500 to-pink-500 border rounded-xl p-2 px-8 disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? 'Loading...' : 'Next'}
            </button>
          </div>

        </form>
      </section>

    </div>
  );
};

export default ParticipationVideoData;