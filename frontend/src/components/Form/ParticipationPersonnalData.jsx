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

// ─── Modals ───────────────────────────────────────────────────────────────────

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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
      <div className="relative bg-[#07070a] border border-white/10 rounded-2xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-[0_24px_80px_rgba(0,0,0,0.7)]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20
            flex items-center justify-center transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
      <div className="relative bg-[#07070a] border border-white/10 rounded-2xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-[0_24px_80px_rgba(0,0,0,0.7)]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20
            flex items-center justify-center transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
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

// ─── Design tokens ────────────────────────────────────────────────────────────

const inputBase =
  'bg-[#080810] border rounded-xl px-4 py-3 w-full text-sm text-white ' +
  'transition-all duration-200 focus:outline-none focus:ring-2 placeholder:text-white/20';

const inputBorder = (hasError) =>
  hasError
    ? 'border-rose-500/70 focus:ring-rose-500/15'
    : 'border-white/10 focus:border-[#8B5CF6]/50 focus:ring-[#8B5CF6]/15';

const labelCls =
  'block text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40 mb-2';

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

// ─── Country Select styles ────────────────────────────────────────────────────

const countrySelectStyles = (hasError) => ({
  control: (base, state) => ({
    ...base,
    minHeight: '46px',
    borderRadius: '0.75rem',
    backgroundColor: '#080810',
    borderColor: hasError
      ? 'rgba(244, 63, 94, 0.7)'
      : state.isFocused
      ? 'rgba(139, 92, 246, 0.5)'
      : 'rgba(255,255,255,0.1)',
    boxShadow: state.isFocused
      ? hasError
        ? '0 0 0 2px rgba(244, 63, 94, 0.15)'
        : '0 0 0 2px rgba(139, 92, 246, 0.15)'
      : 'none',
    '&:hover': {
      borderColor: hasError ? 'rgba(244, 63, 94, 0.7)' : 'rgba(139, 92, 246, 0.4)',
    },
    transition: 'all 0.2s ease',
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: '#08080f',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '0.75rem',
    overflow: 'hidden',
    boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? 'rgba(139,92,246,0.12)' : 'transparent',
    color: '#ffffff',
    cursor: 'pointer',
    fontSize: '0.875rem',
  }),
  singleValue: (base) => ({ ...base, color: '#ffffff' }),
  input: (base) => ({ ...base, color: '#ffffff' }),
  placeholder: (base) => ({ ...base, color: 'rgba(255,255,255,0.2)', fontSize: '0.875rem' }),
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

const normalizeCountryText = (value = '') =>
  String(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const customCountryFilter = (option, inputValue) => {
  if (!inputValue) return true;
  const n = normalizeCountryText(inputValue);
  return normalizeCountryText(option.label).includes(n) || normalizeCountryText(option.value).includes(n);
};

const formatCountryOption = (option) => {
  const iso = String(option?.value || '').toLowerCase();
  const flagSrc = iso ? `https://flagcdn.com/w20/${iso}.png` : '';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
      {flagSrc && (
        <img src={flagSrc} alt="" width={18} height={13}
          style={{ borderRadius: '2px', objectFit: 'cover', flexShrink: 0 }} loading="lazy" />
      )}
      <span>{option?.label || ''}</span>
    </span>
  );
};

const ACQUISITION_MAIN_OPTIONS = ['social_networks', 'word_of_mouth', 'mobile_film_festival', 'search_engine', 'other'];
const SOCIAL_NETWORK_OPTIONS = ['instagram', 'tiktok', 'youtube', 'facebook', 'linkedin', 'x'];

const parseAcquisitionSource = (sourceValue = '') => {
  const normalizedSource = String(sourceValue || '').trim().toLowerCase();
  if (!normalizedSource) return { main: '', social: '', legacyOther: '' };
  if (normalizedSource.startsWith('social_networks:')) {
    const socialValue = normalizedSource.slice('social_networks:'.length);
    return { main: 'social_networks', social: SOCIAL_NETWORK_OPTIONS.includes(socialValue) ? socialValue : '', legacyOther: '' };
  }
  if (ACQUISITION_MAIN_OPTIONS.includes(normalizedSource)) return { main: normalizedSource, social: '', legacyOther: '' };
  return { main: 'other', social: '', legacyOther: String(sourceValue || '').trim() };
};

// ─── Toggle switch ─────────────────────────────────────────────────────────────

const Toggle = ({ id, name, checked, onChange }) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      id={id}
      name={name}
      checked={checked}
      onChange={onChange}
      className="sr-only peer"
    />
    <div className="
      w-11 h-6 rounded-full
      bg-white/10
      peer-focus:ring-2 peer-focus:ring-[#8B5CF6]/30
      peer-checked:bg-gradient-to-r peer-checked:from-violet-600 peer-checked:to-fuchsia-600
      after:content-[''] after:absolute after:top-[2px] after:start-[2px]
      after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all
      peer-checked:after:translate-x-full
      transition-all duration-200
    " />
  </label>
);

// ─── Main component ───────────────────────────────────────────────────────────

const ParticipationPersonnalData = ({ setEtape, formData, setFormData: setFormDataProp }) => {
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isAddressCountryAutoFilled, setIsAddressCountryAutoFilled] = useState(false);
  const [isPhoneAutoFilled, setIsPhoneAutoFilled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contributorsData, setContributorsData] = useState([]);
  const [realisatorSocialNetworks, setRealisatorSocialNetworks] = useState({
    facebook: '', instagram: '', X: '', LinkedIn: '', youtube: '', TikTok: '', other: '',
  });
  const [isSocialNetworksModalOpen, setIsSocialNetworksModalOpen] = useState(false);

  const emptyAddressParts = { street: '', street2: '', zipcode: '', city: '', stateRegion: '', country: '' };
  const getAddressParts = () => ({ ...emptyAddressParts, ...(formData.addressParts || {}) });

  const countryOptions = useMemo(() => countryList().getData(), []);
  const selectedCountryOption = useMemo(
    () => countryOptions.find(o => o.label.toLowerCase() === String(formData.country || '').trim().toLowerCase()) || null,
    [countryOptions, formData.country]
  );
  const selectedPhoneCountry = selectedCountryOption?.value?.toUpperCase() || 'FR';
  const parsedAcquisition = useMemo(() => parseAcquisitionSource(formData.acquisitionSource), [formData.acquisitionSource]);
  const acquisitionMainValue = parsedAcquisition.main;
  const acquisitionSocialValue = parsedAcquisition.social;
  const acquisitionOtherValue = String(formData.acquisitionSourceOther ?? parsedAcquisition.legacyOther);

  const validateAcquisitionSelection = (sourceValue, otherValue) => {
    const { main, social, legacyOther } = parseAcquisitionSource(sourceValue);
    if (!main) return { acquisitionSource: 'Please tell us how you heard about us', acquisitionSourceOther: null };
    if (main === 'social_networks' && !social) return { acquisitionSource: 'Please select a social network', acquisitionSourceOther: null };
    if (main === 'other') {
      const normalized = String(otherValue || legacyOther || '').trim();
      return { acquisitionSource: null, acquisitionSourceOther: validateAcquisitionSource(normalized) };
    }
    return { acquisitionSource: null, acquisitionSourceOther: null };
  };

  const buildAddressFromParts = (parts = {}) => {
    const p = { ...emptyAddressParts, ...parts };
    return [p.street, p.street2, p.city, p.stateRegion, p.zipcode, p.country]
      .map(v => String(v || '').trim()).filter(Boolean).join(', ');
  };

  const validateAddressPart = (fieldName, value) => {
    const v = String(value || '').trim();
    if (fieldName === 'zipcode') {
      if (!v) return 'Zip code is required';
      if (v.length > 20) return 'Zip code is too long';
      return null;
    }
    if (!v) return null;
    if (v.length > 120) return `${fieldName} is too long`;
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
    if (formData.address) initialAddressParts.street = formData.address;
    setFormDataProp({
      ...formData,
      addressParts: initialAddressParts,
      address: buildAddressFromParts(initialAddressParts) || formData.address || '',
    });
  }, [formData, setFormDataProp]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    if (name === 'country') {
      const currentAddressParts = getAddressParts();
      const currentAddressCountry = String(currentAddressParts.country || '').trim();
      const previousCountry = String(formData.country || '').trim();
      const shouldAutofill = !currentAddressCountry || isAddressCountryAutoFilled || currentAddressCountry.toLowerCase() === previousCountry.toLowerCase();
      const nextAddressParts = shouldAutofill ? { ...currentAddressParts, country: fieldValue } : currentAddressParts;
      setFormDataProp({ ...formData, country: fieldValue, addressParts: nextAddressParts, address: buildAddressFromParts(nextAddressParts) });
      setIsAddressCountryAutoFilled(shouldAutofill);
      validateField('country', fieldValue);
      if (shouldAutofill) validateField('addressParts.country', fieldValue);
      return;
    }

    setFormDataProp({ ...formData, [name]: fieldValue });
    validateField(name, fieldValue);
  };

  const handlePhoneChange = (fieldName, value) => {
    const nextValue = value || '';
    if (fieldName === 'mobileNumber') {
      const currentPhone = String(formData.phoneNumber || '').trim();
      const previousMobile = String(formData.mobileNumber || '').trim();
      const shouldAutofill = !currentPhone || isPhoneAutoFilled || currentPhone === previousMobile;
      const nextPhone = shouldAutofill ? nextValue : (formData.phoneNumber || '');
      setFormDataProp({ ...formData, mobileNumber: nextValue, phoneNumber: nextPhone });
      setIsPhoneAutoFilled(shouldAutofill);
      validateField('mobileNumber', nextValue);
      if (shouldAutofill) validateField('phoneNumber', nextPhone);
      return;
    }
    if (fieldName === 'phoneNumber') setIsPhoneAutoFilled(false);
    setFormDataProp({ ...formData, [fieldName]: nextValue });
    validateField(fieldName, nextValue);
  };

  const handleCountrySelect = (selectedOption) => {
    handleChange({ target: { name: 'country', value: selectedOption?.label || '', type: 'text' } });
  };

  const handleAddressPartChange = (fieldName, value) => {
    const currentAddressParts = getAddressParts();
    const nextAddressParts = { ...currentAddressParts, [fieldName]: value };
    setFormDataProp({ ...formData, addressParts: nextAddressParts, address: buildAddressFromParts(nextAddressParts) });
    if (fieldName === 'country') setIsAddressCountryAutoFilled(false);
    validateField(`addressParts.${fieldName}`, value);
  };

  const handleAcquisitionMainChange = (e) => {
    const nextMain = e.target.value;
    let nextSource = '';
    if (nextMain === 'social_networks') nextSource = acquisitionSocialValue ? `social_networks:${acquisitionSocialValue}` : 'social_networks';
    else if (nextMain) nextSource = nextMain;
    const errs = validateAcquisitionSelection(nextSource, acquisitionOtherValue);
    setFormDataProp({ ...formData, acquisitionSource: nextSource, acquisitionSourceOther: acquisitionOtherValue });
    setErrors(prev => ({ ...prev, acquisitionSource: errs.acquisitionSource, acquisitionSourceOther: errs.acquisitionSourceOther }));
  };

  const handleAcquisitionSocialChange = (e) => {
    const nextSocial = String(e.target.value || '').trim().toLowerCase();
    const nextSource = nextSocial ? `social_networks:${nextSocial}` : 'social_networks';
    const errs = validateAcquisitionSelection(nextSource, acquisitionOtherValue);
    setFormDataProp({ ...formData, acquisitionSource: nextSource, acquisitionSourceOther: acquisitionOtherValue });
    setErrors(prev => ({ ...prev, acquisitionSource: errs.acquisitionSource, acquisitionSourceOther: errs.acquisitionSourceOther }));
  };

  const handleAcquisitionOtherChange = (e) => {
    const next = e.target.value;
    const errs = validateAcquisitionSelection(formData.acquisitionSource, next);
    setFormDataProp({ ...formData, acquisitionSourceOther: next });
    setErrors(prev => ({ ...prev, acquisitionSource: errs.acquisitionSource, acquisitionSourceOther: errs.acquisitionSourceOther }));
  };

  const validateField = (fieldName, value) => {
    let error = null;
    switch (fieldName) {
      case 'gender': error = validateGender(value); break;
      case 'firstName': error = validateFirstName(value); break;
      case 'lastName': error = validateLastName(value); break;
      case 'email': error = validateEmail(value); break;
      case 'country': error = validateCountry(value); break;
      case 'phoneNumber': error = validatePhoneNumber(value); break;
      case 'mobileNumber': error = validateMobileNumber(value); break;
      case 'address': error = null; break;
      case 'addressParts.street':
      case 'addressParts.street2':
      case 'addressParts.zipcode':
      case 'addressParts.city':
      case 'addressParts.stateRegion':
      case 'addressParts.country':
        error = validateAddressPart(fieldName.replace('addressParts.', ''), value); break;
      case 'acquisitionSource': {
        const errs = validateAcquisitionSelection(value, formData.acquisitionSourceOther);
        setErrors(prev => ({ ...prev, acquisitionSource: errs.acquisitionSource, acquisitionSourceOther: errs.acquisitionSourceOther }));
        return;
      }
      case 'acquisitionSourceOther': {
        const errs = validateAcquisitionSelection(formData.acquisitionSource, value);
        setErrors(prev => ({ ...prev, acquisitionSource: errs.acquisitionSource, acquisitionSourceOther: errs.acquisitionSourceOther }));
        return;
      }
      case 'ageVerificator': error = validateAgeVerification(value); break;
      default: break;
    }
    setErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  const validateForm = () => {
    const addressParts = getAddressParts();
    const composedAddress = buildAddressFromParts(addressParts);
    const addressPartErrors = validateAddressParts(addressParts);
    const acquisitionErrors = validateAcquisitionSelection(formData.acquisitionSource, formData.acquisitionSourceOther);
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
    if (formData.phoneNumber && formData.phoneNumber.trim() !== '') {
      newErrors.phoneNumber = validatePhoneNumber(formData.phoneNumber);
    }
    setErrors(newErrors);
    return { isValid: !Object.values(newErrors).some(e => e !== null), addressParts, composedAddress };
  };

  const handleSaveContributor = () => {
    setFormDataProp({ ...formData, contributors: contributorsData });
    setIsModalOpen(false);
  };

  const handleSaveSocialNetworks = () => {
    setFormDataProp({ ...formData, socialNetworks: realisatorSocialNetworks });
    setIsSocialNetworksModalOpen(false);
  };

  const handleCloseContributorsModal = () => {
    const hasContributors = Array.isArray(contributorsData) && contributorsData.length > 0;
    setIsModalOpen(false);
    if (!hasContributors && (formData.withContributors || false)) {
      setFormDataProp({ ...formData, withContributors: false });
    }
  };

  const handleCloseSocialNetworksModal = () => {
    const hasAnySocialValue = Object.values(realisatorSocialNetworks || {}).some(v => String(v || '').trim() !== '');
    setIsSocialNetworksModalOpen(false);
    if (!hasAnySocialValue && (formData.withSocialNetworks || false)) {
      setFormDataProp({ ...formData, withSocialNetworks: false });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    const { isValid, addressParts, composedAddress } = validateForm();
    if (isValid) {
      setFormDataProp({ ...formData, addressParts, address: composedAddress });
      setEtape(2);
    } else {
      setSubmitError('Please correct the errors before continuing');
      setIsSubmitting(false);
    }
  };

  const addressParts = getAddressParts();

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="w-full glass-card rounded-3xl p-6 sm:p-8 text-white animate-fade-in">

      {/* Step title */}
      <div className="mb-8">
        <h2 className="text-xl font-bold tracking-tight">Personal Data</h2>
        <p className="text-xs text-white/35 mt-1 font-light">Tell us about yourself</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* ── IDENTITY ─────────────────────────────────────────────────────── */}
        <section>
          <SectionHeader>Identity</SectionHeader>
          <div className="space-y-4">

            {/* Gender */}
            <div>
              <label htmlFor="gender" className={labelCls}>
                Gender <span className="text-mars-primary">*</span>
              </label>
              <select
                name="gender" id="gender"
                value={formData.gender}
                onChange={handleChange}
                className={`${inputBase} ${inputBorder(errors.gender)} [&>option]:bg-[#08080f]`}
              >
                <option value="">Select your gender</option>
                <option value="women">Women</option>
                <option value="man">Man</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && <p className={errorCls}>{errors.gender}</p>}
            </div>

            {/* First + Last name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className={labelCls}>
                  First Name <span className="text-mars-primary">*</span>
                </label>
                <input
                  className={`${inputBase} ${inputBorder(errors.firstName)}`}
                  type="text" name="firstName" id="firstName"
                  value={formData.firstName} onChange={handleChange}
                  placeholder="First name"
                />
                {errors.firstName && <p className={errorCls}>{errors.firstName}</p>}
              </div>
              <div>
                <label htmlFor="lastName" className={labelCls}>
                  Last Name <span className="text-mars-primary">*</span>
                </label>
                <input
                  className={`${inputBase} ${inputBorder(errors.lastName)}`}
                  type="text" name="lastName" id="lastName"
                  value={formData.lastName} onChange={handleChange}
                  placeholder="Last name"
                />
                {errors.lastName && <p className={errorCls}>{errors.lastName}</p>}
              </div>
            </div>

          </div>
        </section>

        <Divider />

        {/* ── CONTACT ──────────────────────────────────────────────────────── */}
        <section>
          <SectionHeader>Contact</SectionHeader>
          <div className="space-y-4">

            {/* Email */}
            <div>
              <label htmlFor="email" className={labelCls}>
                Email <span className="text-mars-primary">*</span>
              </label>
              <input
                className={`${inputBase} ${inputBorder(errors.email)}`}
                type="email" name="email" id="email"
                value={formData.email} onChange={handleChange}
                placeholder="your@email.com"
              />
              {errors.email && <p className={errorCls}>{errors.email}</p>}
            </div>

            {/* Country */}
            <div>
              <label htmlFor="country" className={labelCls}>
                Country <span className="text-mars-primary">*</span>
              </label>
              <Select
                inputId="country" name="country"
                options={countryOptions}
                value={countryOptions.find(o => o.label === formData.country) || null}
                onChange={handleCountrySelect}
                isSearchable
                filterOption={customCountryFilter}
                formatOptionLabel={formatCountryOption}
                placeholder="Select your country"
                className="text-sm"
                styles={countrySelectStyles(errors.country)}
              />
              {errors.country && <p className={errorCls}>{errors.country}</p>}
            </div>

            {/* Phones */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Mobile Number <span className="text-mars-primary">*</span></label>
                <PhoneInput
                  international
                  defaultCountry={selectedPhoneCountry}
                  value={formData.mobileNumber}
                  onChange={(value) => handlePhoneChange('mobileNumber', value)}
                  className={`${inputBase} ${inputBorder(errors.mobileNumber)}`}
                  placeholder="Mobile number"
                />
                {errors.mobileNumber && <p className={errorCls}>{errors.mobileNumber}</p>}
              </div>
              <div>
                <label className={labelCls}>Phone Number</label>
                <PhoneInput
                  international
                  defaultCountry={selectedPhoneCountry}
                  value={formData.phoneNumber}
                  onChange={(value) => handlePhoneChange('phoneNumber', value)}
                  className={`${inputBase} ${inputBorder(errors.phoneNumber)}`}
                  placeholder="Phone number"
                />
                {errors.phoneNumber && <p className={errorCls}>{errors.phoneNumber}</p>}
              </div>
            </div>

          </div>
        </section>

        <Divider />

        {/* ── ADDRESS ──────────────────────────────────────────────────────── */}
        <section>
          <SectionHeader>Address</SectionHeader>
          <div className="space-y-4">

            <div>
              <label htmlFor="street" className={labelCls}>Street</label>
              <input
                className={`${inputBase} ${inputBorder(errors['addressParts.street'])}`}
                type="text" name="street" id="street"
                value={addressParts.street}
                onChange={(e) => handleAddressPartChange('street', e.target.value)}
                placeholder="Street address"
              />
              {errors['addressParts.street'] && <p className={errorCls}>{errors['addressParts.street']}</p>}
            </div>

            <div>
              <label htmlFor="street2" className={labelCls}>Street 2</label>
              <input
                className={`${inputBase} ${inputBorder(errors['addressParts.street2'])}`}
                type="text" name="street2" id="street2"
                value={addressParts.street2}
                onChange={(e) => handleAddressPartChange('street2', e.target.value)}
                placeholder="Apt, suite, building…"
              />
              {errors['addressParts.street2'] && <p className={errorCls}>{errors['addressParts.street2']}</p>}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="zipcode" className={labelCls}>
                  Zip Code <span className="text-mars-primary">*</span>
                </label>
                <input
                  className={`${inputBase} ${inputBorder(errors['addressParts.zipcode'])}`}
                  type="text" name="zipcode" id="zipcode"
                  value={addressParts.zipcode}
                  onChange={(e) => handleAddressPartChange('zipcode', e.target.value)}
                  placeholder="75001"
                />
                {errors['addressParts.zipcode'] && <p className={errorCls}>{errors['addressParts.zipcode']}</p>}
              </div>
              <div>
                <label htmlFor="city" className={labelCls}>City</label>
                <input
                  className={`${inputBase} ${inputBorder(errors['addressParts.city'])}`}
                  type="text" name="city" id="city"
                  value={addressParts.city}
                  onChange={(e) => handleAddressPartChange('city', e.target.value)}
                  placeholder="Paris"
                />
                {errors['addressParts.city'] && <p className={errorCls}>{errors['addressParts.city']}</p>}
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label htmlFor="stateRegion" className={labelCls}>State / Region</label>
                <input
                  className={`${inputBase} ${inputBorder(errors['addressParts.stateRegion'])}`}
                  type="text" name="stateRegion" id="stateRegion"
                  value={addressParts.stateRegion}
                  onChange={(e) => handleAddressPartChange('stateRegion', e.target.value)}
                  placeholder="Île-de-France"
                />
                {errors['addressParts.stateRegion'] && <p className={errorCls}>{errors['addressParts.stateRegion']}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="countryAddress" className={labelCls}>Country</label>
              <input
                className={`${inputBase} ${inputBorder(errors['addressParts.country'])}`}
                type="text" name="countryAddress" id="countryAddress"
                value={addressParts.country}
                onChange={(e) => handleAddressPartChange('country', e.target.value)}
                placeholder={isAddressCountryAutoFilled ? 'Auto-filled from nationality' : 'Country'}
              />
              {errors['addressParts.country'] && <p className={errorCls}>{errors['addressParts.country']}</p>}
            </div>

          </div>
        </section>

        <Divider />

        {/* ── ADDITIONAL ───────────────────────────────────────────────────── */}
        <section>
          <SectionHeader>Additional</SectionHeader>
          <div className="space-y-4">

            {/* Acquisition source */}
            <div>
              <label htmlFor="acquisitionSource" className={labelCls}>
                How did you hear about us? <span className="text-mars-primary">*</span>
              </label>
              <select
                className={`${inputBase} ${inputBorder(errors.acquisitionSource)} [&>option]:bg-[#08080f]`}
                name="acquisitionSource" id="acquisitionSource"
                value={acquisitionMainValue}
                onChange={handleAcquisitionMainChange}
              >
                <option value="">Select an option</option>
                <option value="social_networks">Social networks</option>
                <option value="word_of_mouth">Word of mouth</option>
                <option value="mobile_film_festival">Mobile Film Festival</option>
                <option value="search_engine">Search engine</option>
                <option value="other">Other</option>
              </select>
              {errors.acquisitionSource && <p className={errorCls}>{errors.acquisitionSource}</p>}

              {acquisitionMainValue === 'social_networks' && (
                <select
                  className={`${inputBase} ${inputBorder(errors.acquisitionSource)} mt-3 [&>option]:bg-[#08080f]`}
                  name="acquisitionSourceSocial" id="acquisitionSourceSocial"
                  value={acquisitionSocialValue}
                  onChange={handleAcquisitionSocialChange}
                >
                  <option value="">Select a social network</option>
                  <option value="instagram">Instagram</option>
                  <option value="tiktok">TikTok</option>
                  <option value="youtube">YouTube</option>
                  <option value="facebook">Facebook</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="x">X</option>
                </select>
              )}

              {acquisitionMainValue === 'other' && (
                <div className="mt-3">
                  <input
                    className={`${inputBase} ${inputBorder(errors.acquisitionSourceOther)}`}
                    type="text" name="acquisitionSourceOther" id="acquisitionSourceOther"
                    value={acquisitionOtherValue}
                    onChange={handleAcquisitionOtherChange}
                    placeholder="Please specify"
                  />
                  {errors.acquisitionSourceOther && <p className={errorCls}>{errors.acquisitionSourceOther}</p>}
                </div>
              )}
            </div>

            {/* Age check */}
            <label className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer
              transition-all duration-200 ${
              formData.ageVerificator
                ? 'border-mars-primary/40 bg-mars-primary/[0.05]'
                : errors.ageVerificator
                ? 'border-rose-500/40 bg-rose-500/[0.04]'
                : 'border-white/[0.07] bg-white/[0.02] hover:border-white/15'
            }`}>
              <div className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center
                flex-shrink-0 transition-all duration-200 ${
                formData.ageVerificator ? 'border-mars-primary bg-mars-primary' : 'border-white/20'
              }`}>
                {formData.ageVerificator && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <input
                type="checkbox" name="ageVerificator" id="ageVerificator"
                checked={formData.ageVerificator} onChange={handleChange}
                className="hidden"
              />
              <span className="text-sm text-white/70 leading-relaxed">
                I confirm I am <span className="text-white font-medium">18 years old or older</span>
                <span className="text-mars-primary ml-1">*</span>
              </span>
            </label>
            {errors.ageVerificator && <p className={errorCls}>{errors.ageVerificator}</p>}

          </div>
        </section>

        <Divider />

        {/* ── OPTIONAL FEATURES ────────────────────────────────────────────── */}
        <section>
          <SectionHeader>Optional</SectionHeader>
          <div className="space-y-4">

            {/* Contributors toggle */}
            <div className="flex items-center justify-between p-4 rounded-2xl
              border border-white/[0.07] bg-white/[0.02] hover:border-white/12 transition-colors">
              <div>
                <p className="text-sm font-medium text-white">Contributors</p>
                <p className="text-xs text-white/35 mt-0.5">Add crew members or collaborators</p>
              </div>
              <Toggle
                id="withContributors"
                name="withContributors"
                checked={formData.withContributors || false}
                onChange={(e) => {
                  handleChange(e);
                  if (e.target.checked) setIsModalOpen(true);
                }}
              />
            </div>

            {/* Social networks toggle */}
            <div className="flex items-center justify-between p-4 rounded-2xl
              border border-white/[0.07] bg-white/[0.02] hover:border-white/12 transition-colors">
              <div>
                <p className="text-sm font-medium text-white">Social Networks</p>
                <p className="text-xs text-white/35 mt-0.5">Link your profiles</p>
              </div>
              <Toggle
                id="withSocialNetworks"
                name="withSocialNetworks"
                checked={formData.withSocialNetworks || false}
                onChange={(e) => {
                  handleChange(e);
                  if (e.target.checked) setIsSocialNetworksModalOpen(true);
                }}
              />
            </div>

          </div>
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

        <div className="flex justify-end pt-2">
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

      {/* Modals */}
      <ContributorsModal
        isOpen={isModalOpen}
        onClose={handleCloseContributorsModal}
        contributorsData={contributorsData}
        setContributorsData={setContributorsData}
        onSave={handleSaveContributor}
      />
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
