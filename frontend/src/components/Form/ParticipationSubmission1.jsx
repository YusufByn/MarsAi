import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ParticipationSubmission1 = () => {
  const navigate = useNavigate();

  return (
    <div className=" w-full max-w-md mx-auto p-8 rounded-[40px] glass space-y-6 shadow-xl border border-white/40 min-h-screen bg-green-900 text-white pt-32 pb-20 ">
    
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-mars-primary/10 blur-[150px] rounded-full pointer-events-none z-0"></div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-6">
          <h2>Personnal Data</h2>
          <section className="">
              <form action="" method="get" className=" border-white flex flex-wrap gap-5 ">
                <select name="Gender" id="Gender" className="bg-black">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="They">They</option>
                </select>
                <div className="bg-grey border-white flex flex-wrap gap-5">

                  <div className="space-y-2">
                  <input
                    type="text"
                    name="FirstName"
                    id="FirstName"
                    label="FirstName"
                    placeholder="First Name"
                    className="bg-black" />
                  </div>

                  <div className="space-y-2">
                  <input
                    type="text"
                    name="LastName"
                    id="LastName"
                    placeholder="Last Name"
                    className="bg-black"/>
                  </div>

                  <div className="space-y-2">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="email"
                    className="bg-black"/>
                  </div>

                  <div className="space-y-2">
                  <span>Birthday</span>
                  <input
                    type="date"
                    name="birthday"
                    id="birthday"
                    className="bg-black"/>
                  </div>

                  <div className="space-y-2">
                  <input
                    type="tel"
                    name="PhoneNumber"
                    id="PhoneNumber"
                    placeholder="Phone Number"
                    className="bg-black" />
                  </div>

                  <div className="space-y-2">
                  <input 
                    type="tel"
                    name="MobileNumber"
                    id="MobileNumber"
                    placeholder="Mobile Number"
                    className="bg-black" />
                  </div>

                  <div className="space-y-2">
                  <input
                    type="text"
                    name="adress"
                    placeholder="Adress"
                    id="adress"
                    className="bg-black" />
                  </div>

                  <div className="space-y-2">
                  <input
                    type="text"
                    name="acquisition_source"
                    id="acquisition_source"
                    placeholder="How did you hear about us?"
                    className="bg-black" />
                  </div>

                  <div className="space-y-2">
                  <span>Right accepted*</span>
                  <input
                    type="checkbox"
                    name="rights_accepted"
                    id="rights_accepted"
                    className="bg-black" />
                  </div>

                  <div className="space-y-2">
                  <button
                    type="submit"
                    className="bg-black">
                    next
                  </button>
                  </div>

                </div>                
              </form>
          </section>
          <div className="space-y-2">
            <span>
              *By submitting this video, you confirm that you hold all necessary rights to the content provided and authorize MarsAI to broadcast, reproduce, and use this video, in whole or in part, in its communications media, without limitation in terms of duration or territory.
            </span>
          </div>
      </div>
    </div>
  );
};

export default ParticipationSubmission1;