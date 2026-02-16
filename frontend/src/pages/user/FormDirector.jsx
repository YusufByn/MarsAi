import React, { useState } from 'react';
import ParticipationPersonnalData from '../../components/Form/ParticipationPersonnalData.jsx';
import ParticipationVideoData from '../../components/Form/ParticipationVideoData.jsx';
import ParticipationVideoUpload from '../../components/Form/ParticipationVideoUpload.jsx';



const FormDirector = () => {
  const [etape, setEtape] = useState(1);

  // État centralisé pour toutes les étapes du formulaire
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
      contributors: [], // Ajout des contributeurs
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
      socialMedia: [], // Ajout des réseaux sociaux si nécessaire
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

  // Fonction helper pour mettre à jour une étape spécifique
  const updateStepData = (step, data) => {
    setFormData(prev => ({
      ...prev,
      [step]: { ...prev[step], ...data }
    }));
  };

  return (
    <div className="flex justify-center pt-32 ">
      <div>
        {etape === 1 && (
          <div id="PPD">
            <ParticipationPersonnalData 
              setEtape={setEtape}
              formData={formData.step1}
              setFormData={(data) => updateStepData('step1', data)}
            />
          </div>
        )}
        {etape === 2 && (
          <div id="PVD">
            <ParticipationVideoData 
              setEtape={setEtape}
              formData={formData.step2}
              setFormData={(data) => updateStepData('step2', data)}
            />
          </div>
        )}
        {etape === 3 && (
          <div id="PVU">
            <ParticipationVideoUpload 
              setEtape={setEtape}
              formData={formData.step3}
              setFormData={(data) => updateStepData('step3', data)}
              allFormData={formData}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FormDirector;