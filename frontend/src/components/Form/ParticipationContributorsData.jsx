import React, { useState } from 'react';
import {
  validateGender,
  validateFirstName,
  validateLastName,
  validateEmail,
} from '../../services/formService';

const ROLE_PATTERN = /^[a-zA-Z0-9À-ÿ\s'(),.-]+$/;

const validateProductionRole = (value) => {
  const trimmedValue = String(value || '').trim();

  if (!trimmedValue) return 'Role is required';
  if (trimmedValue.length < 2) return 'Role must be at least 2 characters';
  if (trimmedValue.length > 80) return 'Role is too long';
  if (!ROLE_PATTERN.test(trimmedValue)) return 'Role contains invalid characters';
  return null;
};

const normalizeContributorInput = (contributor = {}) => ({
  gender: String(contributor.gender || '').trim(),
  firstName: String(contributor.firstName || '').trim(),
  lastName: String(contributor.lastName || '').trim(),
  email: String(contributor.email || '').trim().toLowerCase(),
  productionRole: String(contributor.productionRole || '').trim(),
});

const ParticipationContributorsData = ({ contributorsData, setContributorsData, onSave }) => {
  // contributorsData devrait être un tableau
  const contributors = Array.isArray(contributorsData) ? contributorsData : [];
  
  const [showForm, setShowForm] = useState(false);
  const [currentContributor, setCurrentContributor] = useState({
    gender: '',
    firstName: '',
    lastName: '',
    email: '',
    productionRole: ''
  });
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');

  const validateContributorField = (fieldName, value) => {
    switch (fieldName) {
      case 'gender':
        return validateGender(value);
      case 'firstName':
        return validateFirstName(value);
      case 'lastName':
        return validateLastName(value);
      case 'email':
        return validateEmail(value);
      case 'productionRole':
        return validateProductionRole(value);
      default:
        return null;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextContributor = {
      ...currentContributor,
      [name]: value
    };
    setCurrentContributor(nextContributor);

    const normalizedValue = normalizeContributorInput(nextContributor)[name];
    const fieldError = validateContributorField(name, normalizedValue);

    setErrors((prev) => ({
      ...prev,
      [name]: fieldError,
    }));
  };

  const validateContributor = (contributor) => {
    const newErrors = {};

    ['gender', 'firstName', 'lastName', 'email', 'productionRole'].forEach((fieldName) => {
      const fieldError = validateContributorField(fieldName, contributor[fieldName]);
      if (fieldError) {
        newErrors[fieldName] = fieldError;
      }
    });

    return newErrors;
  };

  const addContributor = () => {
    const normalizedContributor = normalizeContributorInput(currentContributor);
    const newErrors = validateContributor(normalizedContributor);
    const contributorAlreadyExists = contributors.some(
      (contributor) => String(contributor.email || '').trim().toLowerCase() === normalizedContributor.email
    );

    if (contributorAlreadyExists) {
      newErrors.email = 'This email is already added';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return null;
    }

    // Ajouter le contributeur à la liste
    const updatedContributors = [...contributors, {
      ...normalizedContributor,
      id: Date.now() // ID temporaire
    }];
    setContributorsData(updatedContributors);

    // Réinitialiser le formulaire
    setCurrentContributor({
      gender: '',
      firstName: '',
      lastName: '',
      email: '',
      productionRole: ''
    });
    setErrors({});
    setShowForm(false);
    setGlobalError('');

    return updatedContributors;
  };

  const removeContributor = (id) => {
    const updatedContributors = contributors.filter(c => c.id !== id);
    setContributorsData(updatedContributors);
  };

  const cancelAdd = () => {
    setCurrentContributor({
      gender: '',
      firstName: '',
      lastName: '',
      email: '',
      productionRole: ''
    });
    setErrors({});
    setShowForm(false);
  };

  const handleSave = () => {
    let currentList = contributors;

    if (showForm) {
      // Si le form est ouvert avec des données, tenter d'ajouter le contributeur d'abord
      const hasData = Object.values(currentContributor).some(v => String(v || '').trim() !== '');

      if (hasData) {
        const result = addContributor();
        if (result === null) return; // validation échouée, erreurs affichées
        currentList = result;
      } else {
        // Form ouvert mais vide → le fermer et vérifier la liste existante
        setShowForm(false);
      }
    }

    if (currentList.length === 0) {
      setGlobalError('You must add at least one contributor');
      return;
    }
    setGlobalError('');
    onSave();
  };


  const getGenderLabel = (gender) => {
    switch(gender) {
      case 'women': return 'Woman';
      case 'man': return 'Man';
      case 'other': return 'Other';
      default: return '';
    }
  };

  return (
    <div className="text-center text-white">
      <div className="mb-5">
        <h2 className="text-xl font-semibold tracking-tight">Contributors</h2>
        <p className="text-gray-400 text-xs mt-1">Add all the contributors of the project</p>
      </div>

      {globalError && (
        <div className="mb-3 p-2 bg-rose-500/15 border border-rose-500/60 rounded-xl text-rose-300 text-xs w-full max-w-md mx-auto">
          {globalError}
        </div>
      )}

      <section className="FormContributors">
        {/* Liste des contributeurs ajoutés */}
        {contributors.length > 0 && (
          <div className="mb-4">
            <h3 className="text-md font-semibold text-white mb-2">
              Added contributors ({contributors.length})
            </h3>
            <div className="grid grid-cols-1 gap-2 justify-items-center">
              {contributors.map((contributor) => (
                <div 
                  key={contributor.id} 
                  className="w-full max-w-md bg-linear-to-br from-violet-950/30 to-fuchsia-950/30 border border-violet-400/25 rounded-xl p-3 relative hover:border-violet-400/45 transition-all text-left"
                >
                  {/* Bouton supprimer */}
                  <button
                    type="button"
                    onClick={() => removeContributor(contributor.id)}
                    className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-rose-500/20 hover:bg-rose-500/40 rounded-lg transition-colors text-rose-300 hover:text-rose-200"
                    title="Remove"
                  >
                    ✕
                  </button>

                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <h4 className="text-white font-semibold text-sm">
                        {contributor.firstName} {contributor.lastName}
                      </h4>
                      <p className="text-purple-300 text-xs font-medium mb-1">
                        {contributor.productionRole}
                      </p>
                      <div className="space-y-0.5">
                        <p className="text-gray-400 text-[10px]">
                          {contributor.email}
                        </p>
                        <p className="text-gray-400 text-[10px]">
                          {getGenderLabel(contributor.gender)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bouton pour afficher le formulaire */}
        {!showForm && (
          <div className="flex justify-center my-2">
            <button
              type="button"
              onClick={() => {
                setGlobalError('');
                setShowForm(true);
              }}
            className="w-full max-w-md bg-violet-600/15 hover:bg-violet-600/25 border-2 border-dashed border-violet-400/40 hover:border-violet-400/70 rounded-xl p-3 text-violet-200 hover:text-violet-100 transition-all flex items-center justify-center gap-2 font-medium text-sm"
            >
              <span className="text-xl">+</span>
              Add
            </button>
          </div>
        )}

        {/* Formulaire d'ajout */}
        {showForm && (
          <div className="grid grid-cols-1 justify-items-center m-2 gap-3">
            <h3 className="text-md font-semibold text-white">New contributor</h3>
            
              {/* Gender */}
              <div className="w-full max-w-md text-left">
                <label className="block text-xs text-gray-400 mb-1 ml-1">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select 
                  name="gender"
                  value={currentContributor.gender}
                  onChange={handleChange}
                  className={`bg-[#0f0f14] border rounded-xl px-3 py-2.5 w-full text-white text-sm ${errors.gender ? 'border-rose-500' : 'border-white/15 focus:border-fuchsia-400/70'}`}
                >
                  <option value="">Select gender</option>
                  <option value="women">Woman</option>
                  <option value="man">Man</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && <p className="text-rose-400 text-xs mt-1">{errors.gender}</p>}
              </div>

              {/* First Name */}
              <div className="w-full max-w-md text-left">
                <label className="block text-xs text-gray-400 mb-1 ml-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input 
                  className={`bg-[#0f0f14] border rounded-xl px-3 py-2.5 w-full text-white text-sm ${errors.firstName ? 'border-rose-500' : 'border-white/15 focus:border-fuchsia-400/70'}`}
                  type="text"
                  name="firstName"
                  value={currentContributor.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                />
                {errors.firstName && <p className="text-rose-400 text-xs mt-1">{errors.firstName}</p>}
              </div>

              {/* Last Name */}
              <div className="w-full max-w-md text-left">
                <label className="block text-xs text-gray-400 mb-1 ml-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input 
                  className={`bg-[#0f0f14] border rounded-xl px-3 py-2.5 w-full text-white text-sm ${errors.lastName ? 'border-rose-500' : 'border-white/15 focus:border-fuchsia-400/70'}`}
                  type="text"
                  name="lastName"
                  value={currentContributor.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                />
                {errors.lastName && <p className="text-rose-400 text-xs mt-1">{errors.lastName}</p>}
              </div>

              {/* Email */}
              <div className="w-full max-w-md text-left">
                <label className="block text-xs text-gray-400 mb-1 ml-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input 
                  className={`bg-[#0f0f14] border rounded-xl px-3 py-2.5 w-full text-white text-sm ${errors.email ? 'border-rose-500' : 'border-white/15 focus:border-fuchsia-400/70'}`}
                  type="email"
                  name="email"
                  value={currentContributor.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                />
                {errors.email && <p className="text-rose-400 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Production Role */}
              <div className="w-full max-w-md text-left">
                <label className="block text-xs text-gray-400 mb-1 ml-1">
                  Role <span className="text-red-500">*</span>
                </label>
                <input
                  className={`bg-[#0f0f14] border rounded-xl px-3 py-2.5 w-full text-white text-sm ${errors.productionRole ? 'border-rose-500' : 'border-white/15 focus:border-fuchsia-400/70'}`}
                  type="text"
                  name="productionRole"
                  value={currentContributor.productionRole}
                  onChange={handleChange}
                  placeholder="Role (e.g. Director)"
                />
                {errors.productionRole && <p className="text-rose-400 text-xs mt-1">{errors.productionRole}</p>}
              </div>

              {/* Boutons Actions Formulaire */}
              <div className="flex gap-2 mt-1 w-full max-w-md">
                <button
                  type="button"
                  onClick={cancelAdd}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/15 rounded-xl py-2 text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={addContributor}
                  className="flex-1 bg-linear-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white border border-white/10 rounded-xl py-2 text-sm transition-all font-medium"
                >
                  Add
                </button>
              </div>
          </div>
        )}

        {/* Bouton de sauvegarde final */}
        <div className="flex justify-center mt-4">
          <button
            type="button"
            onClick={handleSave}
            className="bg-linear-to-r from-violet-600 to-fuchsia-600 text-white border border-white/10 rounded-xl px-6 py-2.5 hover:from-violet-500 hover:to-fuchsia-500 transition-all font-semibold text-sm shadow-[0_8px_24px_rgba(168,85,247,0.35)]"
          >
            Save and continue
          </button>
        </div>
      </section>
    </div>
  );
};

export default ParticipationContributorsData;
