import React, { useState, useEffect } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import './PhoneInputStyles.css';
import { validateGender, validateFirstName, validateLastName, validateEmail, validateCountry, validateAcquisitionSource, validateAgeVerification, validatePhoneNumber, validateMobileNumber } from '../../services/formService';
import ParticipationContributorsData from './ParticipationContributorsData';
import ParticipationSocialNetworks from './ParticipationSocialNetworks';
import { createPortal } from 'react-dom';

// Modal des contributeurs (en dehors du composant pour éviter les re-créations)
const ContributorsModal = ({ isOpen, onClose, contributorsData, setContributorsData, onSave }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative bg-[#07070a] border border-white/10 rounded-2xl p-4 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-[0_20px_80px_rgba(0,0,0,0.55)]">
        {/* Bouton de fermeture */}
        <button 
          onClick={onClose}
          className="sticky top-0 right-0 float-right ml-4 text-white hover:text-gray-300 text-2xl font-bold leading-none z-10"
          aria-label="Close modal"
        >
          ×
        </button>
        
        {/* Contenu de la modal */}
        <ParticipationContributorsData 
          contributorsData={contributorsData}
          setContributorsData={setContributorsData}
          onSave={onSave}
        />
      </div>
    </div>,
    document.body
  );
};

// Modal des réseaux sociaux (en dehors du composant pour éviter les re-créations)
const SocialNetworksModal = ({ isOpen, onClose, realisatorSocialNetworks, setRealisatorSocialNetworks, onSave }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative bg-[#07070a] border border-white/10 rounded-2xl p-4 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-[0_20px_80px_rgba(0,0,0,0.55)]">
        {/* Bouton de fermeture */}
        <button 
          onClick={onClose}
          className="sticky top-0 right-0 float-right ml-4 text-white hover:text-gray-300 text-2xl font-bold leading-none z-10"
          aria-label="Close modal"
        >
          ×
        </button>
        
        {/* Contenu de la modal */}
        <ParticipationSocialNetworks 
          realisatorSocialNetworks={realisatorSocialNetworks}
          setRealisatorSocialNetworks={setRealisatorSocialNetworks}
          onSave={onSave}
        />
      </div>
    </div>,
    document.body
  );
};

const ParticipationPersonnalData = ({setEtape, formData, setFormData: setFormDataProp}) => {
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isAddressCountryAutoFilled, setIsAddressCountryAutoFilled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contributorsData, setContributorsData] = useState([]);
  const [realisatorSocialNetworks, setRealisatorSocialNetworks] = useState({
    facebook: '',
    instagram: '',
    X: '',
    LinkedIn: '',
    youtube: '',
    TikTok: '',
    other: '',
  });
  const [isSocialNetworksModalOpen, setIsSocialNetworksModalOpen] = useState(false);
  const inputBaseClass = 'bg-[#0f0f14] border rounded-xl px-3 py-2.5 w-full text-sm text-white transition-colors';
  const inputBorderClass = (hasError) => hasError ? 'border-rose-500' : 'border-white/15 focus:border-fuchsia-400/70';
  const fieldWrapperClass = 'w-full max-w-md';
  const labelClass = 'block text-left text-xs text-gray-300 mb-1 ml-1';
  const emptyAddressParts = {
    street: '',
    street2: '',
    zipcode: '',
    city: '',
    stateRegion: '',
    country: '',
  };

  const getAddressParts = () => ({
    ...emptyAddressParts,
    ...(formData.addressParts || {}),
  });

  const buildAddressFromParts = (parts = {}) => {
    const normalizedParts = {
      ...emptyAddressParts,
      ...parts,
    };

    return [
      normalizedParts.street,
      normalizedParts.street2,
      normalizedParts.city,
      normalizedParts.stateRegion,
      normalizedParts.zipcode,
      normalizedParts.country,
    ]
      .map((value) => String(value || '').trim())
      .filter(Boolean)
      .join(', ');
  };

  const validateAddressPart = (fieldName, value) => {
    const trimmedValue = String(value || '').trim();

    if (fieldName === 'zipcode') {
      if (!trimmedValue) return 'Zip code is required';
      if (trimmedValue.length > 20) return 'Zip code is too long';
      return null;
    }

    if (!trimmedValue) return null;
    if (trimmedValue.length > 120) return `${fieldName} is too long`;
    return null;
  };

  const validateAddressParts = (addressParts) => ({
    'addressParts.street': validateAddressPart('street', addressParts.street),
    'addressParts.street2': validateAddressPart('street2', addressParts.street2),
    'addressParts.zipcode': validateAddressPart('zipcode', addressParts.zipcode),
    'addressParts.city': validateAddressPart('city', addressParts.city),
    'addressParts.stateRegion': validateAddressPart('state/region', addressParts.stateRegion),
    'addressParts.country': validateAddressPart('country', addressParts.country),
  });

  useEffect(() => {
    if (formData.addressParts) return;

    const initialAddressParts = { ...emptyAddressParts };
    if (formData.address) {
      initialAddressParts.street = formData.address;
    }

    setFormDataProp({
      ...formData,
      addressParts: initialAddressParts,
      address: buildAddressFromParts(initialAddressParts) || formData.address || '',
    });
  }, [formData, setFormDataProp]);

  // Gestion des changements de champs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    if (name === 'country') {
      const currentAddressParts = getAddressParts();
      const shouldAutofillAddressCountry = !String(currentAddressParts.country || '').trim();
      const nextAddressParts = shouldAutofillAddressCountry
        ? { ...currentAddressParts, country: fieldValue }
        : currentAddressParts;
      const composedAddress = buildAddressFromParts(nextAddressParts);

      setFormDataProp({
        ...formData,
        country: fieldValue,
        addressParts: nextAddressParts,
        address: composedAddress,
      });
      setIsAddressCountryAutoFilled(shouldAutofillAddressCountry);

      validateField('country', fieldValue);
      if (shouldAutofillAddressCountry) {
        validateField('addressParts.country', fieldValue);
      }
      return;
    }
    
    setFormDataProp({
      ...formData,
      [name]: fieldValue
    });

    // Validation en temps réel
    validateField(name, fieldValue);
  };

  // Gestion spécifique pour les champs PhoneInput
  const handlePhoneChange = (fieldName, value) => {
    setFormDataProp({
      ...formData,
      [fieldName]: value || ''
    });

    // Validation en temps réel
    validateField(fieldName, value || '');
  };

  const handleAddressPartChange = (fieldName, value) => {
    const currentAddressParts = getAddressParts();
    const nextAddressParts = {
      ...currentAddressParts,
      [fieldName]: value,
    };
    const composedAddress = buildAddressFromParts(nextAddressParts);

    setFormDataProp({
      ...formData,
      addressParts: nextAddressParts,
      address: composedAddress,
    });

    if (fieldName === 'country') {
      setIsAddressCountryAutoFilled(false);
    }

    validateField(`addressParts.${fieldName}`, value);
  };

  // Validation d'un champ spécifique
  const validateField = (fieldName, value) => {
    let error = null;

    switch(fieldName) {
      case 'gender':
        error = validateGender(value);
        break;
      case 'firstName':
        error = validateFirstName(value);
        break;
      case 'lastName':
        error = validateLastName(value);
        break;
      case 'email':
        error = validateEmail(value);
        break;
      case 'country':
        error = validateCountry(value);
        break;
      case 'phoneNumber':
        error = validatePhoneNumber(value);
        break;
      case 'mobileNumber':
        error = validateMobileNumber(value);
        break;
      case 'address':
        error = null;
        break;
      case 'addressParts.street':
      case 'addressParts.street2':
      case 'addressParts.zipcode':
      case 'addressParts.city':
      case 'addressParts.stateRegion':
      case 'addressParts.country':
        error = validateAddressPart(fieldName.replace('addressParts.', ''), value);
        break;
      case 'acquisitionSource':
        error = validateAcquisitionSource(value);
        break;
      case 'ageVerificator':
        error = validateAgeVerification(value);
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
    const addressParts = getAddressParts();
    const composedAddress = buildAddressFromParts(addressParts);
    const addressPartErrors = validateAddressParts(addressParts);

    const newErrors = {
      gender: validateGender(formData.gender),
      firstName: validateFirstName(formData.firstName),
      lastName: validateLastName(formData.lastName),
      email: validateEmail(formData.email),
      country: validateCountry(formData.country),
      mobileNumber: validateMobileNumber(formData.mobileNumber),
      ...addressPartErrors,
      acquisitionSource: validateAcquisitionSource(formData.acquisitionSource),
      ageVerificator: validateAgeVerification(formData.ageVerificator),
    };

    // Valider phoneNumber seulement s'il n'est pas vide
    if (formData.phoneNumber && formData.phoneNumber.trim() !== '') {
      newErrors.phoneNumber = validatePhoneNumber(formData.phoneNumber);
    }

    setErrors(newErrors);

    // Retourne true si aucune erreur
    const isValid = !Object.values(newErrors).some(error => error !== null);
    return {
      isValid,
      addressParts,
      composedAddress,
    };
  };

  // Fonction pour sauvegarder les données des contributeurs
  const handleSaveContributor = () => {
    setFormDataProp({
      ...formData,
      contributors: contributorsData
    });
    setIsModalOpen(false);
  };

  // Fonction pour sauvegarder les données des réseaux sociaux
  const handleSaveSocialNetworks = () => {
    setFormDataProp({
      ...formData,
      socialNetworks: realisatorSocialNetworks
    });
    setIsSocialNetworksModalOpen(false);
  };

  const handleCloseContributorsModal = () => {
    const hasContributors = Array.isArray(contributorsData) && contributorsData.length > 0;
    setIsModalOpen(false);

    if (!hasContributors && (formData.withContributors || false)) {
      setFormDataProp({
        ...formData,
        withContributors: false,
      });
    }
  };

  const handleCloseSocialNetworksModal = () => {
    const hasAnySocialValue = Object.values(realisatorSocialNetworks || {})
      .some((value) => String(value || '').trim() !== '');
    setIsSocialNetworksModalOpen(false);

    if (!hasAnySocialValue && (formData.withSocialNetworks || false)) {
      setFormDataProp({
        ...formData,
        withSocialNetworks: false,
      });
    }
  };

  // Soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    const { isValid, addressParts, composedAddress } = validateForm();

    if (isValid) {
      setFormDataProp({
        ...formData,
        addressParts,
        address: composedAddress,
      });
      // Formulaire valide, passer à l'étape suivante
      setEtape(2);
    } else {
      setSubmitError('Please correct the errors before continuing');
      setIsSubmitting(false);
    }
  };

  const addressParts = getAddressParts();

  return (
    <div className="w-full max-w-3xl border border-white/10 bg-[#07070a]/95 shadow-[0_10px_60px_rgba(168,85,247,0.2)] backdrop-blur rounded-2xl p-4 sm:p-6 text-center text-white">
      <h2 className="text-2xl font-semibold tracking-tight">Personnal Data</h2>
      <p className="text-xs text-gray-400 mt-1">Step 1 - Tell us about yourself</p>
      
      <div className="text-center flex justify-center gap-2 mt-4 mb-2">
        <div className="w-8 h-8 rounded-full border border-fuchsia-400/60 bg-linear-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-xs font-semibold">
          1
        </div>
        <div className="w-8 h-8 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-xs">
          2
        </div>
        <div className="w-8 h-8 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-xs">
          3
        </div>
      </div>

      <section className="FormContainer">
        <form onSubmit={handleSubmit} method="post" className="grid grid-cols-1 justify-items-center mt-6 gap-4">

          {/* Civility */}
          <div className={fieldWrapperClass}>
            <label htmlFor="gender" className={labelClass}>
              Gender <span className="text-red-500">*</span>
            </label>
            <select 
              name="gender"
              id="gender"
              value={formData.gender}
              onChange={handleChange}
              className={`${inputBaseClass} ${inputBorderClass(errors.gender)}`}
            >
              <option value="">Select your gender</option>
              <option value="women">Women</option>
              <option value="man">Man</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && <p className="text-rose-400 text-xs mt-1 text-left">{errors.gender}</p>}
          </div>

          <div className={fieldWrapperClass}>
            <label htmlFor="firstName" className={labelClass}>
              First Name <span className="text-red-500">*</span>
            </label>
            <input 
              className={`${inputBaseClass} ${inputBorderClass(errors.firstName)}`}
              type="text"
              name="firstName"
              id="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
            />
            {errors.firstName && <p className="text-rose-400 text-xs mt-1 text-left">{errors.firstName}</p>}
          </div>

          <div className={fieldWrapperClass}>
            <label htmlFor="lastName" className={labelClass}>
              Last Name <span className="text-red-500">*</span>
            </label>
            <input 
              className={`${inputBaseClass} ${inputBorderClass(errors.lastName)}`}
              type="text"
              name="lastName"
              id="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
            />
            {errors.lastName && <p className="text-rose-400 text-xs mt-1 text-left">{errors.lastName}</p>}
          </div>

          {/* Email */}
          <div className={fieldWrapperClass}>
            <label htmlFor="email" className={labelClass}>
              Email <span className="text-red-500">*</span>
            </label>
            <input 
              className={`${inputBaseClass} ${inputBorderClass(errors.email)}`}
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email"
            />
            {errors.email && <p className="text-rose-400 text-xs mt-1 text-left">{errors.email}</p>}
          </div>

          <div className={fieldWrapperClass}>
            <label htmlFor="country" className={labelClass}>
              Country <span className="text-red-500">*</span>
            </label>
            <input 
              className={`${inputBaseClass} ${inputBorderClass(errors.country)}`}
              type="text"
              name="country"
              id="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Country"
            />
            {errors.country && <p className="text-rose-400 text-xs mt-1 text-left">{errors.country}</p>}
          </div>

          {/* Phones */}
          <div className={fieldWrapperClass}>
            <label className={labelClass}>
              Phone Number
            </label>
            <PhoneInput
              international
              defaultCountry="FR"
              value={formData.phoneNumber}
              onChange={(value) => handlePhoneChange('phoneNumber', value)}
              className={`${inputBaseClass} ${inputBorderClass(errors.phoneNumber)}`}
              placeholder="Phone Number"
            />
            {errors.phoneNumber && <p className="text-rose-400 text-xs mt-1 text-left">{errors.phoneNumber}</p>}
          </div>
          
          <div className={fieldWrapperClass}>
            <label className={labelClass}>
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <PhoneInput
              international
              defaultCountry="FR"
              value={formData.mobileNumber}
              onChange={(value) => handlePhoneChange('mobileNumber', value)}
              className={`${inputBaseClass} ${inputBorderClass(errors.mobileNumber)}`}
              placeholder="Mobile Number"
            />
            {errors.mobileNumber && <p className="text-rose-400 text-xs mt-1 text-left">{errors.mobileNumber}</p>}
          </div>

          {/* Address */}
          <div className={fieldWrapperClass}>
            <label htmlFor="street" className={labelClass}>
              Street
            </label>
            <input 
              className={`${inputBaseClass} ${inputBorderClass(errors['addressParts.street'])}`}
              type="text"
              name="street"
              id="street"
              value={addressParts.street}
              onChange={(e) => handleAddressPartChange('street', e.target.value)}
              placeholder="Street"
            />
            {errors['addressParts.street'] && <p className="text-rose-400 text-xs mt-1 text-left">{errors['addressParts.street']}</p>}
          </div>

          <div className={fieldWrapperClass}>
            <label htmlFor="street2" className={labelClass}>
              Street 2
            </label>
            <input 
              className={`${inputBaseClass} ${inputBorderClass(errors['addressParts.street2'])}`}
              type="text"
              name="street2"
              id="street2"
              value={addressParts.street2}
              onChange={(e) => handleAddressPartChange('street2', e.target.value)}
              placeholder="Street 2"
            />
            {errors['addressParts.street2'] && <p className="text-rose-400 text-xs mt-1 text-left">{errors['addressParts.street2']}</p>}
          </div>

          <div className={fieldWrapperClass}>
            <label htmlFor="zipcode" className={labelClass}>
              Zip Code <span className="text-red-500">*</span>
            </label>
            <input 
              className={`${inputBaseClass} ${inputBorderClass(errors['addressParts.zipcode'])}`}
              type="text"
              name="zipcode"
              id="zipcode"
              value={addressParts.zipcode}
              onChange={(e) => handleAddressPartChange('zipcode', e.target.value)}
              placeholder="Zip Code"
            />
            {errors['addressParts.zipcode'] && <p className="text-rose-400 text-xs mt-1 text-left">{errors['addressParts.zipcode']}</p>}
          </div>

          <div className={fieldWrapperClass}>
            <label htmlFor="city" className={labelClass}>
              City
            </label>
            <input 
              className={`${inputBaseClass} ${inputBorderClass(errors['addressParts.city'])}`}
              type="text"
              name="city"
              id="city"
              value={addressParts.city}
              onChange={(e) => handleAddressPartChange('city', e.target.value)}
              placeholder="City"
            />
            {errors['addressParts.city'] && <p className="text-rose-400 text-xs mt-1 text-left">{errors['addressParts.city']}</p>}
          </div>

          <div className={fieldWrapperClass}>
            <label htmlFor="stateRegion" className={labelClass}>
              State / Region
            </label>
            <input 
              className={`${inputBaseClass} ${inputBorderClass(errors['addressParts.stateRegion'])}`}
              type="text"
              name="stateRegion"
              id="stateRegion"
              value={addressParts.stateRegion}
              onChange={(e) => handleAddressPartChange('stateRegion', e.target.value)}
              placeholder="State / Region"
            />
            {errors['addressParts.stateRegion'] && <p className="text-rose-400 text-xs mt-1 text-left">{errors['addressParts.stateRegion']}</p>}
          </div>

          <div className={fieldWrapperClass}>
            <label htmlFor="countryAddress" className={labelClass}>
              Country
            </label>
            <input 
              className={`${inputBaseClass} ${inputBorderClass(errors['addressParts.country'])}`}
              type="text"
              name="countryAddress"
              id="countryAddress"
              value={addressParts.country}
              onChange={(e) => handleAddressPartChange('country', e.target.value)}
              placeholder={isAddressCountryAutoFilled ? 'Auto-filled from country field' : 'Country'}
            />
            {errors['addressParts.country'] && <p className="text-rose-400 text-xs mt-1 text-left">{errors['addressParts.country']}</p>}
          </div>

          {/* Acquisition source */}
          <div className={fieldWrapperClass}>
            <label htmlFor="acquisitionSource" className={labelClass}>
              How did you hear about us? <span className="text-red-500">*</span>
            </label>
            <input 
              className={`${inputBaseClass} ${inputBorderClass(errors.acquisitionSource)}`}
              type="text"
              name="acquisitionSource"
              id="acquisitionSource"
              value={formData.acquisitionSource}
              onChange={handleChange}
              placeholder="How did you hear about us?"
            />
            {errors.acquisitionSource && <p className="text-rose-400 text-xs mt-1 text-left">{errors.acquisitionSource}</p>}
          </div>

          <div className={fieldWrapperClass}>
            <label className="flex items-center gap-2">
              <input 
                className={`bg-[#0f0f14] border rounded p-2 ${errors.ageVerificator ? 'border-rose-500' : 'border-white/10'}`}
                type="checkbox"
                name="ageVerificator"
                id="ageVerificator"
                checked={formData.ageVerificator}
                onChange={handleChange}
              />
              <span className="text-sm">Are you 18 years old or older? <span className="text-red-500">*</span></span>
            </label>
            {errors.ageVerificator && <p className="text-rose-400 text-xs mt-1 text-left">{errors.ageVerificator}</p>}
          </div>
          
          <span className="text-sm text-gray-300">Do you have contributors ?</span>
          <div className={fieldWrapperClass}>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="withContributors"
                id="withContributors"
                checked={formData.withContributors || false}
                onChange={(e) => {
                  handleChange(e);
                  if (e.target.checked) {
                    setIsModalOpen(true);
                  }
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-fuchsia-500/50 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-white/20 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-linear-to-r peer-checked:from-violet-600 peer-checked:to-fuchsia-600"></div>
            </label>
          </div>
          <span className="text-sm text-gray-300">Do you have social networks ?</span>
          <div className={fieldWrapperClass}>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="withSocialNetworks"
                id="withSocialNetworks"
                checked={formData.withSocialNetworks || false}
                onChange={(e) => {
                  handleChange(e);
                  if (e.target.checked) {
                    setIsSocialNetworksModalOpen(true);
                  }
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-fuchsia-500/50 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-white/20 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-linear-to-r peer-checked:from-violet-600 peer-checked:to-fuchsia-600"></div>
            </label>
          </div>

          {/* Message d'erreur général */}
          {submitError && (
            <div className="w-full max-w-md text-rose-400 text-xs text-center">
              {submitError}
            </div>
          )}

          {/* Button */}
          <div className="mt-4 p-1 place-self-centered">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="bg-linear-to-r from-violet-600 to-fuchsia-600 border border-white/10 rounded-xl px-7 py-2.5 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-violet-500 hover:to-fuchsia-500 shadow-[0_8px_24px_rgba(168,85,247,0.35)] transition-all">
              {isSubmitting ? 'Loading...' : 'Next'}
            </button>
          </div>

        </form>
      </section>

      {/* Modal des contributeurs */}
      <ContributorsModal 
        isOpen={isModalOpen} 
        onClose={handleCloseContributorsModal}
        contributorsData={contributorsData}
        setContributorsData={setContributorsData}
        onSave={handleSaveContributor}
      />
      {/* Modal des réseaux sociaux */}
      <SocialNetworksModal 
        isOpen={isSocialNetworksModalOpen}
        onClose={handleCloseSocialNetworksModal}
        realisatorSocialNetworks={realisatorSocialNetworks}
        setRealisatorSocialNetworks={setRealisatorSocialNetworks}
        onSave={handleSaveSocialNetworks}
      />

    </div>
  );
};

export default ParticipationPersonnalData;