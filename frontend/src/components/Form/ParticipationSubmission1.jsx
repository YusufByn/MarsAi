import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ParticipationSubmission1 = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20">
    
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-mars-primary/10 blur-[150px] rounded-full pointer-events-none z-0"></div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-6">
        <h2>Personnal Data</h2>
          <form action="" method="get">
            <select name="Gender" id="Gender">
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="They">They</option>
            </select>
            <input type="text" name="FirstName" id="FirstName" />
            <input type="text" name="LastName" id="LastName"/>
            <input type="email" name="email" id="email" />
            <input type="date" name="birthday" id="birthday" />
          </form>
          
      </div>
    </div>
  );
};

export default ParticipationSubmission1;