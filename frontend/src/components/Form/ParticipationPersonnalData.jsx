import React, { useState, useEffect, useMemo } from 'react';
import PhoneInput from 'react-phone-number-input';
import Select from 'react-select';
import countryList from 'react-select-country-list';
import 'react-phone-number-input/style.css';
import './PhoneInputStyles.css';
import { validateGender, validateFirstName, validateLastName, validateEmail, validateCountry, validateAcquisitionSource, validateAgeVerification, validatePhoneNumber, validateMobileNumber } from '../../services/formService';
import ParticipationContributorsData from './ParticipationContributorsData';
import ParticipationSocialNetworks from './ParticipationSocialNetworks';
import { createPortal } from 'react-dom';
import {
  SectionHeading, labelClass, inputClass, inputBg, inputStyle,
  errorClass, selectStyles, primaryButtonClass, primaryButtonStyle,
  secondaryButtonClass, secondaryButtonStyle,
} from './formStyles';

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

const normalizeCountryText = (value = '') =>
  String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const customCountryFilter = (option, inputValue) => {
  if (!inputValue) return true;

  const normalizedInput = normalizeCountryText(inputValue);
  const normalizedLabel = normalizeCountryText(option.label);
  const normalizedValue = normalizeCountryText(option.value);

  return normalizedLabel.includes(normalizedInput) || normalizedValue.includes(normalizedInput);
};

const formatCountryOption = (option) => {
  const iso = String(option?.value || '').toLowerCase();
  const flagSrc = iso ? `https://flagcdn.com/w20/${iso}.png` : '';

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
      {flagSrc ? (
        <img
          src={flagSrc}
          alt=""
          width={18}
          height={13}
          style={{ borderRadius: '2px', objectFit: 'cover', flexShrink: 0 }}
          loading="lazy"
        />
      ) : null}
      <span>{option?.label || ''}</span>
    </span>
  );
};

const ACQUISITION_MAIN_OPTIONS = ['social_networks', 'word_of_mouth', 'mobile_film_festival', 'search_engine', 'other'];
const SOCIAL_NETWORK_OPTIONS = ['instagram', 'tiktok', 'youtube', 'facebook', 'linkedin', 'x'];

const parseAcquisitionSource = (sourceValue = '') => {
  const normalizedSource = String(sourceValue || '').trim().toLowerCase();

  if (!normalizedSource) {
    return { main: '', social: '', legacyOther: '' };
  }

  if (normalizedSource.startsWith('social_networks:')) {
    const socialValue = normalizedSource.slice('social_networks:'.length);
    return {
      main: 'social_networks',
      social: SOCIAL_NETWORK_OPTIONS.includes(socialValue) ? socialValue : '',
      legacyOther: '',
    };
  }

  if (ACQUISITION_MAIN_OPTIONS.includes(normalizedSource)) {
    return { main: normalizedSource, social: '', legacyOther: '' };
  }

  // Compatibilité avec d'anciennes valeurs en texte libre.
  return { main: 'other', social: '', legacyOther: String(sourceValue || '').trim() };
};

const ParticipationPersonnalData = ({setEtape, formData, setFormData: setFormDataProp}) => {
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isAddressCountryAutoFilled, setIsAddressCountryAutoFilled] = useState(false);
  const [isPhoneAutoFilled, setIsPhoneAutoFilled] = useState(false);
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
  const fieldWrapperClass = 'w-full space-y-0';
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
  const countryOptions = useMemo(() => countryList().getData(), []);
  const selectedCountryOption = useMemo(
    () => countryOptions.find(
      (option) => option.label.toLowerCase() === String(formData.country || '').trim().toLowerCase()
    ) || null,
    [countryOptions, formData.country]
  );
  const selectedPhoneCountry = selectedCountryOption?.value?.toUpperCase() || 'FR';
  const parsedAcquisition = useMemo(
    () => parseAcquisitionSource(formData.acquisitionSource),
    [formData.acquisitionSource]
  );
  const acquisitionMainValue = parsedAcquisition.main;
  const acquisitionSocialValue = parsedAcquisition.social;
  const acquisitionOtherValue = String(
    formData.acquisitionSourceOther ?? parsedAcquisition.legacyOther
  );

  const validateAcquisitionSelection = (sourceValue, otherValue) => {
    const { main, social, legacyOther } = parseAcquisitionSource(sourceValue);

    if (!main) {
      return {
        acquisitionSource: 'Please tell us how you heard about us',
        acquisitionSourceOther: null,
      };
    }

    if (main === 'social_networks' && !social) {
      return {
        acquisitionSource: 'Please select a social network',
        acquisitionSourceOther: null,
      };
    }

    if (main === 'other') {
      const normalizedOtherValue = String(otherValue || legacyOther || '').trim();
      return {
        acquisitionSource: null,
        acquisitionSourceOther: validateAcquisitionSource(normalizedOtherValue),
      };
    }

    return {
      acquisitionSource: null,
      acquisitionSourceOther: null,
    };
  };

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
      const currentAddressCountry = String(currentAddressParts.country || '').trim();
      const previousCountry = String(formData.country || '').trim();
      const shouldAutofillAddressCountry = !currentAddressCountry
        || isAddressCountryAutoFilled
        || currentAddressCountry.toLowerCase() === previousCountry.toLowerCase();
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
    const nextValue = value || '';

    if (fieldName === 'mobileNumber') {
      const currentPhoneNumber = String(formData.phoneNumber || '').trim();
      const previousMobileNumber = String(formData.mobileNumber || '').trim();
      const shouldAutofillPhoneNumber = !currentPhoneNumber
        || isPhoneAutoFilled
        || currentPhoneNumber === previousMobileNumber;
      const nextPhoneNumber = shouldAutofillPhoneNumber ? nextValue : (formData.phoneNumber || '');

      setFormDataProp({
        ...formData,
        mobileNumber: nextValue,
        phoneNumber: nextPhoneNumber,
      });
      setIsPhoneAutoFilled(shouldAutofillPhoneNumber);

      validateField('mobileNumber', nextValue);
      if (shouldAutofillPhoneNumber) {
        validateField('phoneNumber', nextPhoneNumber);
      }
      return;
    }

    if (fieldName === 'phoneNumber') {
      setIsPhoneAutoFilled(false);
    }

    setFormDataProp({
      ...formData,
      [fieldName]: nextValue
    });

    // Validation en temps réel
    validateField(fieldName, nextValue);
  };

  const handleCountrySelect = (selectedOption) => {
    handleChange({
      target: {
        name: 'country',
        value: selectedOption?.label || '',
        type: 'text',
      },
    });
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

  const handleAcquisitionMainChange = (e) => {
    const nextMain = e.target.value;
    let nextAcquisitionSource = '';

    if (nextMain === 'social_networks') {
      nextAcquisitionSource = acquisitionSocialValue
        ? `social_networks:${acquisitionSocialValue}`
        : 'social_networks';
    } else if (nextMain) {
      nextAcquisitionSource = nextMain;
    }

    const acquisitionErrors = validateAcquisitionSelection(nextAcquisitionSource, acquisitionOtherValue);

    setFormDataProp({
      ...formData,
      acquisitionSource: nextAcquisitionSource,
      acquisitionSourceOther: acquisitionOtherValue,
    });
    setErrors((prev) => ({
      ...prev,
      acquisitionSource: acquisitionErrors.acquisitionSource,
      acquisitionSourceOther: acquisitionErrors.acquisitionSourceOther,
    }));
  };

  const handleAcquisitionSocialChange = (e) => {
    const nextSocial = String(e.target.value || '').trim().toLowerCase();
    const nextAcquisitionSource = nextSocial
      ? `social_networks:${nextSocial}`
      : 'social_networks';
    const acquisitionErrors = validateAcquisitionSelection(nextAcquisitionSource, acquisitionOtherValue);

    setFormDataProp({
      ...formData,
      acquisitionSource: nextAcquisitionSource,
      acquisitionSourceOther: acquisitionOtherValue,
    });
    setErrors((prev) => ({
      ...prev,
      acquisitionSource: acquisitionErrors.acquisitionSource,
      acquisitionSourceOther: acquisitionErrors.acquisitionSourceOther,
    }));
  };

  const handleAcquisitionOtherChange = (e) => {
    const nextOtherValue = e.target.value;
    const acquisitionErrors = validateAcquisitionSelection(formData.acquisitionSource, nextOtherValue);

    setFormDataProp({
      ...formData,
      acquisitionSourceOther: nextOtherValue,
    });
    setErrors((prev) => ({
      ...prev,
      acquisitionSource: acquisitionErrors.acquisitionSource,
      acquisitionSourceOther: acquisitionErrors.acquisitionSourceOther,
    }));
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
        {
          const acquisitionErrors = validateAcquisitionSelection(value, formData.acquisitionSourceOther);
          setErrors((prev) => ({
            ...prev,
            acquisitionSource: acquisitionErrors.acquisitionSource,
            acquisitionSourceOther: acquisitionErrors.acquisitionSourceOther,
          }));
          return;
        }
      case 'acquisitionSourceOther':
        {
          const acquisitionErrors = validateAcquisitionSelection(formData.acquisitionSource, value);
          setErrors((prev) => ({
            ...prev,
            acquisitionSource: acquisitionErrors.acquisitionSource,
            acquisitionSourceOther: acquisitionErrors.acquisitionSourceOther,
          }));
          return;
        }
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
    const acquisitionErrors = validateAcquisitionSelection(
      formData.acquisitionSource,
      formData.acquisitionSourceOther
    );

    const newErrors = {
      gender: validateGender(formData.gender),
      firstName: validateFirstName(formData.firstName),
      lastName: validateLastName(formData.lastName),
      email: validateEmail(formData.email),
      country: validateCountry(formData.country),
      mobileNumber: validateMobileNumber(formData.mobileNumber),
      ...addressPartErrors,
      acquisitionSource: acquisitionErrors.acquisitionSource,
      acquisitionSourceOther: acquisitionErrors.acquisitionSourceOther,
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

  // Shared select style for native <select>
  const nativeSelectClass = (hasError) =>
    `w-full h-[66px] px-8 text-base text-white bg-white/[0.03] border focus:outline-none transition-colors appearance-none cursor-pointer ${
      hasError ? 'border-rose-500' : 'border-white/10 focus:border-white/25'
    }`;

  return (
    <form onSubmit={handleSubmit} method="post" className="space-y-16">

      {/* ── Section 1: Identité du réalisateur ── */}
      <div className="space-y-8">
        <SectionHeading>Identité du réalisateur</SectionHeading>

        {/* Gender */}
        <div className={fieldWrapperClass}>
          <label htmlFor="gender" className={labelClass}>
            Genre <span className="text-rose-500">*</span>
          </label>
          <select
            name="gender" id="gender"
            value={formData.gender} onChange={handleChange}
            className={nativeSelectClass(errors.gender)}
            style={inputStyle}
          >
            <option value="">Sélectionner</option>
            <option value="women">Femme</option>
            <option value="man">Homme</option>
            <option value="other">Autre</option>
          </select>
          {errors.gender && <p className={errorClass}>{errors.gender}</p>}
        </div>

        {/* First + Last name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className={fieldWrapperClass}>
            <label htmlFor="firstName" className={labelClass}>Prénom <span className="text-rose-500">*</span></label>
            <input
              className={`${inputBg} ${inputClass(errors.firstName)}`}
              style={inputStyle}
              type="text" name="firstName" id="firstName"
              value={formData.firstName} onChange={handleChange}
              placeholder="Prénom"
            />
            {errors.firstName && <p className={errorClass}>{errors.firstName}</p>}
          </div>
          <div className={fieldWrapperClass}>
            <label htmlFor="lastName" className={labelClass}>Nom <span className="text-rose-500">*</span></label>
            <input
              className={`${inputBg} ${inputClass(errors.lastName)}`}
              style={inputStyle}
              type="text" name="lastName" id="lastName"
              value={formData.lastName} onChange={handleChange}
              placeholder="Nom de famille"
            />
            {errors.lastName && <p className={errorClass}>{errors.lastName}</p>}
          </div>
        </div>

        {/* Email */}
        <div className={fieldWrapperClass}>
          <label htmlFor="email" className={labelClass}>Email <span className="text-rose-500">*</span></label>
          <input
            className={`${inputBg} ${inputClass(errors.email)}`}
            style={inputStyle}
            type="email" name="email" id="email"
            value={formData.email} onChange={handleChange}
            placeholder="nom@exemple.com"
          />
          {errors.email && <p className={errorClass}>{errors.email}</p>}
        </div>

        {/* Country */}
        <div className={fieldWrapperClass}>
          <label htmlFor="country" className={labelClass}>Pays <span className="text-rose-500">*</span></label>
          <Select
            inputId="country" name="country"
            options={countryOptions}
            value={countryOptions.find((option) => option.label === formData.country) || null}
            onChange={handleCountrySelect}
            isSearchable filterOption={customCountryFilter}
            formatOptionLabel={formatCountryOption}
            placeholder="Sélectionner un pays"
            styles={selectStyles(errors.country)}
          />
          {errors.country && <p className={errorClass}>{errors.country}</p>}
        </div>
      </div>

      {/* ── Section 2: Coordonnées ── */}
      <div className="space-y-8">
        <SectionHeading>Coordonnées</SectionHeading>

        {/* Phones */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className={fieldWrapperClass}>
            <label className={labelClass}>Téléphone</label>
            <PhoneInput
              international defaultCountry={selectedPhoneCountry}
              value={formData.phoneNumber}
              onChange={(value) => handlePhoneChange('phoneNumber', value)}
              className={`${inputBg} ${inputClass(errors.phoneNumber)}`}
              style={inputStyle}
              placeholder="Téléphone"
            />
            {errors.phoneNumber && <p className={errorClass}>{errors.phoneNumber}</p>}
          </div>
          <div className={fieldWrapperClass}>
            <label className={labelClass}>Mobile <span className="text-rose-500">*</span></label>
            <PhoneInput
              international defaultCountry={selectedPhoneCountry}
              value={formData.mobileNumber}
              onChange={(value) => handlePhoneChange('mobileNumber', value)}
              className={`${inputBg} ${inputClass(errors.mobileNumber)}`}
              style={inputStyle}
              placeholder="Mobile"
            />
            {errors.mobileNumber && <p className={errorClass}>{errors.mobileNumber}</p>}
          </div>
        </div>

        {/* Address */}
        <div className={fieldWrapperClass}>
          <label htmlFor="street" className={labelClass}>Rue</label>
          <input
            className={`${inputBg} ${inputClass(errors['addressParts.street'])}`}
            style={inputStyle}
            type="text" name="street" id="street"
            value={addressParts.street}
            onChange={(e) => handleAddressPartChange('street', e.target.value)}
            placeholder="Numéro et nom de rue"
          />
          {errors['addressParts.street'] && <p className={errorClass}>{errors['addressParts.street']}</p>}
        </div>

        <div className={fieldWrapperClass}>
          <label htmlFor="street2" className={labelClass}>Complément d'adresse</label>
          <input
            className={`${inputBg} ${inputClass(errors['addressParts.street2'])}`}
            style={inputStyle}
            type="text" name="street2" id="street2"
            value={addressParts.street2}
            onChange={(e) => handleAddressPartChange('street2', e.target.value)}
            placeholder="Appartement, bâtiment..."
          />
          {errors['addressParts.street2'] && <p className={errorClass}>{errors['addressParts.street2']}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className={fieldWrapperClass}>
            <label htmlFor="zipcode" className={labelClass}>Code postal <span className="text-rose-500">*</span></label>
            <input
              className={`${inputBg} ${inputClass(errors['addressParts.zipcode'])}`}
              style={inputStyle}
              type="text" name="zipcode" id="zipcode"
              value={addressParts.zipcode}
              onChange={(e) => handleAddressPartChange('zipcode', e.target.value)}
              placeholder="Code postal"
            />
            {errors['addressParts.zipcode'] && <p className={errorClass}>{errors['addressParts.zipcode']}</p>}
          </div>
          <div className={fieldWrapperClass}>
            <label htmlFor="city" className={labelClass}>Ville</label>
            <input
              className={`${inputBg} ${inputClass(errors['addressParts.city'])}`}
              style={inputStyle}
              type="text" name="city" id="city"
              value={addressParts.city}
              onChange={(e) => handleAddressPartChange('city', e.target.value)}
              placeholder="Ville"
            />
            {errors['addressParts.city'] && <p className={errorClass}>{errors['addressParts.city']}</p>}
          </div>
          <div className={fieldWrapperClass}>
            <label htmlFor="stateRegion" className={labelClass}>Région</label>
            <input
              className={`${inputBg} ${inputClass(errors['addressParts.stateRegion'])}`}
              style={inputStyle}
              type="text" name="stateRegion" id="stateRegion"
              value={addressParts.stateRegion}
              onChange={(e) => handleAddressPartChange('stateRegion', e.target.value)}
              placeholder="Région / État"
            />
            {errors['addressParts.stateRegion'] && <p className={errorClass}>{errors['addressParts.stateRegion']}</p>}
          </div>
        </div>

        <div className={fieldWrapperClass}>
          <label htmlFor="countryAddress" className={labelClass}>Pays (adresse)</label>
          <input
            className={`${inputBg} ${inputClass(errors['addressParts.country'])}`}
            style={inputStyle}
            type="text" name="countryAddress" id="countryAddress"
            value={addressParts.country}
            onChange={(e) => handleAddressPartChange('country', e.target.value)}
            placeholder={isAddressCountryAutoFilled ? 'Rempli automatiquement' : 'Pays'}
          />
          {errors['addressParts.country'] && <p className={errorClass}>{errors['addressParts.country']}</p>}
        </div>
      </div>

      {/* ── Section 3: Options ── */}
      <div className="space-y-8">
        <SectionHeading>Options</SectionHeading>

        {/* Acquisition source */}
        <div className={fieldWrapperClass}>
          <label htmlFor="acquisitionSource" className={labelClass}>
            Comment avez-vous entendu parler de nous ? <span className="text-rose-500">*</span>
          </label>
          <select
            className={nativeSelectClass(errors.acquisitionSource)}
            style={inputStyle}
            name="acquisitionSource" id="acquisitionSource"
            value={acquisitionMainValue} onChange={handleAcquisitionMainChange}
          >
            <option value="">Sélectionner</option>
            <option value="social_networks">Réseaux sociaux</option>
            <option value="word_of_mouth">Bouche à oreille</option>
            <option value="mobile_film_festival">Mobile Film Festival</option>
            <option value="search_engine">Moteur de recherche</option>
            <option value="other">Autre</option>
          </select>
          {errors.acquisitionSource && <p className={errorClass}>{errors.acquisitionSource}</p>}
          {acquisitionMainValue === 'social_networks' && (
            <div className="mt-4">
              <select
                className={nativeSelectClass(errors.acquisitionSource)}
                style={inputStyle}
                name="acquisitionSourceSocial" id="acquisitionSourceSocial"
                value={acquisitionSocialValue} onChange={handleAcquisitionSocialChange}
              >
                <option value="">Choisir un réseau</option>
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
                <option value="youtube">YouTube</option>
                <option value="facebook">Facebook</option>
                <option value="linkedin">LinkedIn</option>
                <option value="x">X</option>
              </select>
            </div>
          )}
          {acquisitionMainValue === 'other' && (
            <div className="mt-4">
              <input
                className={`${inputBg} ${inputClass(errors.acquisitionSourceOther)}`}
                style={inputStyle}
                type="text" name="acquisitionSourceOther" id="acquisitionSourceOther"
                value={acquisitionOtherValue} onChange={handleAcquisitionOtherChange}
                placeholder="Préciser..."
              />
              {errors.acquisitionSourceOther && <p className={errorClass}>{errors.acquisitionSourceOther}</p>}
            </div>
          )}
        </div>

        {/* Age + Contributors + Social toggles */}
        <div className="space-y-5">
          {/* Age */}
          <label className="flex items-center gap-4 cursor-pointer group">
            <input
              type="checkbox" name="ageVerificator" id="ageVerificator"
              checked={formData.ageVerificator} onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-10 h-6 rounded-full border border-white/10 bg-white/5 relative transition-colors peer-checked:bg-[#51A2FF]/20 peer-checked:border-[#51A2FF]/40 shrink-0">
              <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white/30 transition-transform peer-checked:translate-x-4 group-has-[:checked]:translate-x-4" />
            </div>
            <span className="text-sm text-white/60 group-hover:text-white transition-colors">
              J'ai 18 ans ou plus <span className="text-rose-500">*</span>
            </span>
          </label>
          {errors.ageVerificator && <p className={errorClass}>{errors.ageVerificator}</p>}

          {/* Contributors */}
          <label className="flex items-center gap-4 cursor-pointer group">
            <input
              type="checkbox" name="withContributors" id="withContributors"
              checked={formData.withContributors || false}
              onChange={(e) => { handleChange(e); if (e.target.checked) setIsModalOpen(true); }}
              className="sr-only peer"
            />
            <div className="w-10 h-6 rounded-full border border-white/10 bg-white/5 relative transition-colors peer-checked:bg-[#51A2FF]/20 peer-checked:border-[#51A2FF]/40 shrink-0">
              <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white/30 transition-transform group-has-[:checked]:translate-x-4" />
            </div>
            <span className="text-sm text-white/60 group-hover:text-white transition-colors">J'ai des contributeurs</span>
          </label>

          {/* Social networks */}
          <label className="flex items-center gap-4 cursor-pointer group">
            <input
              type="checkbox" name="withSocialNetworks" id="withSocialNetworks"
              checked={formData.withSocialNetworks || false}
              onChange={(e) => { handleChange(e); if (e.target.checked) setIsSocialNetworksModalOpen(true); }}
              className="sr-only peer"
            />
            <div className="w-10 h-6 rounded-full border border-white/10 bg-white/5 relative transition-colors peer-checked:bg-[#51A2FF]/20 peer-checked:border-[#51A2FF]/40 shrink-0">
              <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white/30 transition-transform group-has-[:checked]:translate-x-4" />
            </div>
            <span className="text-sm text-white/60 group-hover:text-white transition-colors">J'ai des réseaux sociaux</span>
          </label>
        </div>
      </div>

      {/* Error + Submit */}
      {submitError && (
        <p className="text-rose-400 text-sm text-center">{submitError}</p>
      )}

      <button
        type="submit" disabled={isSubmitting}
        className={primaryButtonClass(isSubmitting)}
        style={primaryButtonStyle}
      >
        {isSubmitting ? 'Chargement...' : 'Étape suivante'}
      </button>

      {/* Modals */}
      <ContributorsModal
        isOpen={isModalOpen} onClose={handleCloseContributorsModal}
        contributorsData={contributorsData} setContributorsData={setContributorsData}
        onSave={handleSaveContributor}
      />
      <SocialNetworksModal
        isOpen={isSocialNetworksModalOpen} onClose={handleCloseSocialNetworksModal}
        realisatorSocialNetworks={realisatorSocialNetworks}
        setRealisatorSocialNetworks={setRealisatorSocialNetworks}
        onSave={handleSaveSocialNetworks}
      />
    </form>
  );
};

export default ParticipationPersonnalData;