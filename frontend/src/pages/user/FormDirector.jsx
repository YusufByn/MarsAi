import React, { useState } from 'react';
import ParticipationPersonnalData from '../../components/Form/ParticipationPersonnalData.jsx';
import ParticipationVideoData from '../../components/Form/ParticipationVideoData.jsx';
import ParticipationVideoUpload from '../../components/Form/ParticipationVideoUpload.jsx';

const STEPS = [
  { num: 1, label: 'Director' },
  { num: 2, label: 'Film Data' },
  { num: 3, label: 'Upload' },
];

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
);

const FormDirector = () => {
  const [etape, setEtape] = useState(1);

  const [formData, setFormData] = useState({
    step1: {
      gender: '',
      firstName: '',
      lastName: '',
      email: '',
      country: '',
      phoneNumber: '',
      mobileNumber: '',
      address: '',
      addressParts: {
        street: '',
        street2: '',
        zipcode: '',
        city: '',
        stateRegion: '',
        country: '',
      },
      acquisitionSource: '',
      acquisitionSourceOther: '',
      ageVerificator: false,
      contributors: [],
    },
    step2: {
      title: '',
      titleEN: '',
      language: '',
      synopsis: '',
      synopsisEN: '',
      techResume: '',
      creativeResume: '',
      classification: '',
      tags: [],
      socialMedia: [],
    },
    step3: {
      coverImage: null,
      still1: null,
      still2: null,
      still3: null,
      videoFile: null,
      subtitle: null,
      rightsAccepted: false,
      newsletterSubscription: false,
    }
  });

  const updateStepData = (step, data) => {
    setFormData(prev => ({
      ...prev,
      [step]: { ...prev[step], ...data }
    }));
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-black selection:text-white overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <header className="relative pt-44 pb-14 px-6 flex flex-col items-center text-center bg-black">
        <div className="flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
            border border-white/10 bg-white/5 mb-8 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-white/60 font-bold">
              Open Submissions — 2026
            </span>
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter
            italic uppercase leading-[0.85] mb-5">
            Submit <span className="mars-text-gradient">Your Film</span>
          </h1>

          <p className="text-base md:text-xl text-white/35 font-light max-w-lg">
            Share your AI-powered creative vision with our international jury
          </p>
        </div>
      </header>

      {/* ── STEPPER ──────────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex items-start justify-center px-6 mb-8 max-w-lg mx-auto">
        {STEPS.map((step, i) => (
          <React.Fragment key={step.num}>
            <div className="flex flex-col items-center gap-2.5 min-w-[72px]">
              <div className={`
                flex items-center justify-center w-10 h-10 rounded-full border-2
                font-bold text-sm transition-all duration-300
                ${etape === step.num
                  ? 'border-mars-primary bg-mars-primary text-white scale-110 shadow-lg shadow-mars-primary/35'
                  : etape > step.num
                  ? 'border-mars-primary/50 bg-mars-primary/10 text-mars-primary'
                  : 'border-white/[0.08] bg-white/[0.03] text-white/25'}
              `}>
                {etape > step.num ? <CheckIcon /> : step.num}
              </div>
              <span className={`
                text-[9px] uppercase tracking-[0.2em] font-bold
                transition-colors duration-300 text-center leading-tight
                ${etape === step.num
                  ? 'text-white'
                  : etape > step.num
                  ? 'text-mars-primary/60'
                  : 'text-white/20'}
              `}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex-1 flex items-center pt-5 px-2">
                <div className={`h-px w-full transition-all duration-500
                  ${etape > step.num ? 'bg-mars-primary/35' : 'bg-white/[0.06]'}`}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* ── FORM STEPS ───────────────────────────────────────────────────────── */}
      <main className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pb-28">
        {etape === 1 && (
          <ParticipationPersonnalData
            setEtape={setEtape}
            formData={formData.step1}
            setFormData={(data) => updateStepData('step1', data)}
          />
        )}
        {etape === 2 && (
          <ParticipationVideoData
            setEtape={setEtape}
            formData={formData.step2}
            setFormData={(data) => updateStepData('step2', data)}
          />
        )}
        {etape === 3 && (
          <ParticipationVideoUpload
            setEtape={setEtape}
            formData={formData.step3}
            setFormData={(data) => updateStepData('step3', data)}
            allFormData={formData}
          />
        )}
      </main>

    </div>
  );
};

export default FormDirector;
