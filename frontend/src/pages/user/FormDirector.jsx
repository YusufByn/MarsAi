import React, { useState } from 'react';
import ParticipationPersonnalData from '../../components/Form/ParticipationPersonnalData.jsx';
import ParticipationVideoData from '../../components/Form/ParticipationVideoData.jsx';
import ParticipationVideoUpload from '../../components/Form/ParticipationVideoUpload.jsx';

const STEP_LABELS = ['Réalisateur', 'Œuvre', 'Fichiers'];

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
    <div className="min-h-screen text-white overflow-x-hidden" style={{ background: '#050505' }}>

      {/* Background blobs */}
      <div className="fixed top-1/3 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none z-0"
        style={{ background: 'rgba(21,93,252,0.12)', filter: 'blur(160px)' }} />
      <div className="fixed bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none z-0"
        style={{ background: 'rgba(152,16,250,0.12)', filter: 'blur(160px)' }} />

      {/* Page header — "Soumission" + step indicator */}
      <div className="relative z-10 border-b border-white/[0.06] mt-14"
        style={{ background: 'rgba(5,5,5,0.95)' }}>
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-8 sm:py-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <h1
              className="font-black italic tracking-[-0.05em] uppercase leading-none text-white"
              style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)' }}
            >
              Soumission
            </h1>
            <p className="text-[11px] font-bold tracking-[0.4em] uppercase mt-3"
              style={{ color: '#51A2FF' }}>
              Protocole Étape {etape} / 3 — {STEP_LABELS[etape - 1]}
            </p>
          </div>

          {/* Step bars */}
          <div className="flex gap-2 sm:gap-3 shrink-0">
            {[1, 2, 3].map(step => (
              <div
                key={step}
                className="h-1 w-14 sm:w-16 rounded-full transition-all duration-500"
                style={{
                  background: step <= etape ? '#51A2FF' : 'rgba(255,255,255,0.05)',
                  boxShadow: step === etape ? '0 0 10px rgba(81,162,255,0.8)' : 'none',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Form content */}
      <div className="relative z-10 max-w-[900px] mx-auto px-4 sm:px-6 pt-12 pb-24">
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
      </div>
    </div>
  );
};

export default FormDirector;
