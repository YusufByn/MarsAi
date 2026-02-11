import React, { useState, useEffect } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import './PhoneInputStyles.css';
import { validateGender, validateFirstName, validateLastName, validateEmail, validateCountry, validateAddress, validateAcquisitionSource, validateAgeVerification, validatePhoneNumber, validateMobileNumber } from '../../services/formService';
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
      <div className="relative bg-[#050505] border border-white/10 rounded-xl p-4 max-w-xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
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
      <div className="relative bg-[#050505] border border-white/10 rounded-xl p-4 max-w-xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
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

  // Gestion des changements de champs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    
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
        error = validateAddress(value);
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
    const newErrors = {
      gender: validateGender(formData.gender),
      firstName: validateFirstName(formData.firstName),
      lastName: validateLastName(formData.lastName),
      email: validateEmail(formData.email),
      country: validateCountry(formData.country),
      mobileNumber: validateMobileNumber(formData.mobileNumber),
      address: validateAddress(formData.address),
      acquisitionSource: validateAcquisitionSource(formData.acquisitionSource),
      ageVerificator: validateAgeVerification(formData.ageVerificator),
    };

    // Valider phoneNumber seulement s'il n'est pas vide
    if (formData.phoneNumber && formData.phoneNumber.trim() !== '') {
      newErrors.phoneNumber = validatePhoneNumber(formData.phoneNumber);
    }

    setErrors(newErrors);

    // Retourne true si aucune erreur
    return !Object.values(newErrors).some(error => error !== null);
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

  // Soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    if (validateForm()) {
      // Formulaire valide, passer à l'étape suivante
      console.log('Form data:', formData);
      setEtape(2);
    } else {
      setSubmitError('Please correct the errors before continuing');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border border-white/10 bg-[#050505] rounded-xl p-2 text-center ">
      <h2 className="p-2">Personnal Data</h2>
      
      <div className="text-center flex flex-raw space-between justify-center gap-2">
        <div className="border rounded-full w-7 h-7 bg-purple-500">
          1
        </div>
        <div className="border rounded-full w-7 h-7">
          2
        </div>
        <div className="border rounded-full w-7 h-7">
          3
        </div>
      </div>

      <section className="FormContainer">
        <form onSubmit={handleSubmit} method="post" className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 justify-items-center m-5 gap-5">

          {/* Civility */}
          <div className="w-60">
            <label htmlFor="gender" className="block text-left text-xs text-gray-400 mb-1 ml-1">
              Gender <span className="text-red-500">*</span>
            </label>
            <select 
              name="gender"
              id="gender"
              value={formData.gender}
              onChange={handleChange}
              className={`bg-black/50 border rounded-xl p-2 w-60 ${errors.gender ? 'border-red-500' : 'border-white/10'}`}
            >
              <option value="">Select your gender</option>
              <option value="women">Women</option>
              <option value="man">Man</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
          </div>

          <div className="w-60">
            <label htmlFor="firstName" className="block text-left text-xs text-gray-400 mb-1 ml-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <input 
              className={`bg-black/50 border rounded-xl p-2 w-60 ${errors.firstName ? 'border-red-500' : 'border-white/10'}`}
              type="text"
              name="firstName"
              id="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
            />
            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
          </div>

          <div className="w-60">
            <label htmlFor="lastName" className="block text-left text-xs text-gray-400 mb-1 ml-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input 
              className={`bg-black/50 border rounded-xl p-2 w-60 ${errors.lastName ? 'border-red-500' : 'border-white/10'}`}
              type="text"
              name="lastName"
              id="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
            />
            {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
          </div>

          {/* Email */}
          <div className="w-60">
            <label htmlFor="email" className="block text-left text-xs text-gray-400 mb-1 ml-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input 
              className={`bg-black/50 border rounded-xl p-2 w-60 ${errors.email ? 'border-red-500' : 'border-white/10'}`}
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div className="w-60">
            <label htmlFor="country" className="block text-left text-xs text-gray-400 mb-1 ml-1">
              Country <span className="text-red-500">*</span>
            </label>
            <input 
              className={`bg-black/50 border rounded-xl p-2 w-60 ${errors.country ? 'border-red-500' : 'border-white/10'}`}
              type="text"
              name="country"
              id="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Country"
            />
            {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
          </div>

          {/* Phones */}
          <div className="w-60">
            <label className="block text-left text-xs text-gray-400 mb-1 ml-1">
              Phone Number
            </label>
            <PhoneInput
              international
              defaultCountry="FR"
              value={formData.phoneNumber}
              onChange={(value) => handlePhoneChange('phoneNumber', value)}
              className={`bg-black/50 border rounded-xl p-2 ${errors.phoneNumber ? 'border-red-500' : 'border-white/10'}`}
              placeholder="Phone Number"
            />
            {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
          </div>
          
          <div className="w-60">
            <label className="block text-left text-xs text-gray-400 mb-1 ml-1">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <PhoneInput
              international
              defaultCountry="FR"
              value={formData.mobileNumber}
              onChange={(value) => handlePhoneChange('mobileNumber', value)}
              className={`bg-black/50 border rounded-xl p-2 ${errors.mobileNumber ? 'border-red-500' : 'border-white/10'}`}
              placeholder="Mobile Number"
            />
            {errors.mobileNumber && <p className="text-red-500 text-sm mt-1">{errors.mobileNumber}</p>}
          </div>

          {/* Address */}
          <div className="w-60">
            <label htmlFor="address" className="block text-left text-xs text-gray-400 mb-1 ml-1">
              Address <span className="text-red-500">*</span>
            </label>
            <input 
              className={`bg-black/50 border rounded-xl p-2 w-60 ${errors.address ? 'border-red-500' : 'border-white/10'}`}
              type="text"
              name="address"
              id="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </div>

          {/* Acquisition source */}
          <div className="w-60">
            <label htmlFor="acquisitionSource" className="block text-left text-xs text-gray-400 mb-1 ml-1">
              How did you hear about us? <span className="text-red-500">*</span>
            </label>
            <input 
              className={`bg-black/50 border rounded-xl p-2 w-60 ${errors.acquisitionSource ? 'border-red-500' : 'border-white/10'}`}
              type="text"
              name="acquisitionSource"
              id="acquisitionSource"
              value={formData.acquisitionSource}
              onChange={handleChange}
              placeholder="How did you hear about us?"
            />
            {errors.acquisitionSource && <p className="text-red-500 text-sm mt-1">{errors.acquisitionSource}</p>}
          </div>

          <div className="w-60">
            <label className="flex items-center gap-2">
              <input 
                className={`bg-black/50 border rounded p-2 ${errors.ageVerificator ? 'border-red-500' : 'border-white/10'}`}
                type="checkbox"
                name="ageVerificator"
                id="ageVerificator"
                checked={formData.ageVerificator}
                onChange={handleChange}
              />
              <span className="text-sm">Are you 18 years old or older? <span className="text-red-500">*</span></span>
            </label>
            {errors.ageVerificator && <p className="text-red-500 text-sm mt-1">{errors.ageVerificator}</p>}
          </div>
          
          <span>Do you have contributors ?</span>
          <div className="w-60">
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
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <span>Do you have social networks ?</span>
          <div className="w-60">
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
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Message d'erreur général */}
          {submitError && (
            <div className="w-60 text-red-500 text-center">
              {submitError}
            </div>
          )}

          {/* Button */}
          <div className="m-5 p-1 gap-5 place-self-centered">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="bg-linear-to-r from-purple-500 to-pink-500 border rounded-xl p-2 px-8 disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? 'Loading...' : 'Next'}
            </button>
          </div>

        </form>
      </section>

      {/* Modal des contributeurs */}
      <ContributorsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        contributorsData={contributorsData}
        setContributorsData={setContributorsData}
        onSave={handleSaveContributor}
      />
      {/* Modal des réseaux sociaux */}
      <SocialNetworksModal 
        isOpen={isSocialNetworksModalOpen}
        onClose={() => setIsSocialNetworksModalOpen(false)}
        realisatorSocialNetworks={realisatorSocialNetworks}
        setRealisatorSocialNetworks={setRealisatorSocialNetworks}
        onSave={handleSaveSocialNetworks}
      />

    </div>
  );
};

export default ParticipationPersonnalData;