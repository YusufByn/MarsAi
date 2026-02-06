import React, { useState } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import './PhoneInputStyles.css';
import { validateGender, validateFirstName, validateLastName, validateEmail, validateCountry, validateAddress, validateAcquisitionSource, validateAgeVerification, validatePhoneNumber, validateMobileNumber } from '../../services/formService';

const ParticipationPersonnalData = ({setEtape, formData, setFormData: setFormDataProp}) => {
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

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
      phoneNumber: validatePhoneNumber(formData.phoneNumber),
      mobileNumber: validateMobileNumber(formData.mobileNumber),
      address: validateAddress(formData.address),
      acquisitionSource: validateAcquisitionSource(formData.acquisitionSource),
      ageVerificator: validateAgeVerification(formData.ageVerificator),
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
        <div className="border rounded-xl w-5  bg-purple-500">
          1
        </div>
        <div className="border rounded-xl w-5">
          2
        </div>
        <div className="border rounded-xl w-5">
          3
        </div>
      </div>

      <section className="FormContainer">
        <form onSubmit={handleSubmit} method="post" className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 justify-items-center m-5 gap-5">

          {/* Civility */}
          <div className="w-60">
            <select 
              name="gender"
              id="gender"
              value={formData.gender}
              onChange={handleChange}
              className={`bg-black/50 border rounded-xl p-2 w-60 ${errors.gender ? 'border-red-500' : ''}`}
            >
              <option value="">Select your gender</option>
              <option value="women">Women</option>
              <option value="man">Man</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
          </div>

          <div className="w-60">
            <input 
              className={`bg-black/50 border rounded-xl p-2 w-60 ${errors.firstName ? 'border-red-500' : ''}`}
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
            <input 
              className={`bg-black/50 border rounded-xl p-2 w-60 ${errors.lastName ? 'border-red-500' : ''}`}
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
            <input 
              className={`bg-black/50 border rounded-xl p-2 w-60 ${errors.email ? 'border-red-500' : ''}`}
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
            <input 
              className={`bg-black/50 border rounded-xl p-2 w-60 ${errors.country ? 'border-red-500' : ''}`}
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
            <PhoneInput
              international
              defaultCountry="FR"
              value={formData.phoneNumber}
              onChange={(value) => handlePhoneChange('phoneNumber', value)}
              className={`bg-black/50 border rounded-xl p-2 ${errors.phoneNumber ? 'border-red-500' : ''}`}
              placeholder="Phone Number"
            />
            {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
          </div>

          <div className="w-60">
            <PhoneInput
              international
              defaultCountry="FR"
              value={formData.mobileNumber}
              onChange={(value) => handlePhoneChange('mobileNumber', value)}
              className={`bg-black/50 border rounded-xl p-2 ${errors.mobileNumber ? 'border-red-500' : ''}`}
              placeholder="Mobile Number"
            />
            {errors.mobileNumber && <p className="text-red-500 text-sm mt-1">{errors.mobileNumber}</p>}
          </div>

          {/* Address */}
          <div className="w-60">
            <input 
              className={`bg-black/50 border rounded-xl p-2 w-60 ${errors.address ? 'border-red-500' : ''}`}
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
            <input 
              className={`bg-black/50 border rounded-xl p-2 w-60 ${errors.acquisitionSource ? 'border-red-500' : ''}`}
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
                className={`bg-black/50 border rounded p-2 ${errors.ageVerificator ? 'border-red-500' : ''}`}
                type="checkbox"
                name="ageVerificator"
                id="ageVerificator"
                checked={formData.ageVerificator}
                onChange={handleChange}
              />
              <span>Are you 18 years old or older?</span>
            </label>
            {errors.ageVerificator && <p className="text-red-500 text-sm mt-1">{errors.ageVerificator}</p>}
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

    </div>
  );
};

export default ParticipationPersonnalData;