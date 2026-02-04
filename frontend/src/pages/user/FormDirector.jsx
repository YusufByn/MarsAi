import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ParticipationPersonnalData from '../../components/Form/ParticipationPersonnalData.jsx';
import ParticipationVideoData from '../../components/Form/ParticipationVideoData.jsx';
import ParticipationVideoUpload from '../../components/Form/ParticipationVideoUpload.jsx';



const FormDirector = () => {
const navigate = useNavigate();
const [etape, setEtape] = useState(1);

  

  return (
    <div className="flex justify-center pt-32 ">
      
            <div>
              {etape === 1 && (
              <div id="PPD">
                <ParticipationPersonnalData setEtape={setEtape}/>
              </div>
              )}
              {etape === 2 && (
              <div id="PVD">
                <ParticipationVideoData setEtape={setEtape} />
              </div>
              )}
              {etape === 3 && (
              <div id="PVU">
                <ParticipationVideoUpload setEtape={setEtape} />
              </div>
              )}
            </div>

    </div>
  );
};

export default FormDirector;