import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ParticipationSubmission1 from '../../components/Form/ParticipationSubmission1.jsx';

const FormDirector = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-mars-primary/10 blur-[150px] rounded-full pointer-events-none z-0"></div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-6">
        <h1>Hello World</h1>
            <div>
                <ParticipationSubmission1/>
            </div>
      </div>
    </div>
  );
};

export default FormDirector;