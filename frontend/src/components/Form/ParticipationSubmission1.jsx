import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ParticipationSubmission1 = () => {
  const navigate = useNavigate();

  return (
    <div className="">

          <h2>Personnal Data</h2>

          <section className="FormContainer flex justify-center ">
            <form action="" method="get" className="">

            {/* Civility */}
              <div className="flex gap-x-10 gap-y-10 p-5">
                <div className="">
                  <select name="Gender" id="Gender" className="bg-black border border-wite rounded-full w-50 p-2">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="They">non-binaries</option>
                  </select>
                </div>
                  <div className="">
                  <input
                    type="text"
                    name="FirstName"
                    id="FirstName"
                    label="FirstName"
                    placeholder="First Name"
                    className="bg-black border border-white rounded-full w-50 p-2" />
                  </div>
                  <div className="">
                  <input
                    type="text"
                    name="LastName"
                    id="LastName"
                    placeholder="Last Name"
                    className="bg-black border border-white rounded-full w-50 p-2"/>
                  </div>
                </div>

                {/* Email & Birthday */}
                <div className="flex flex-auto gap-x-5 gap-y-5 p-5">
                  <div className="">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="email"
                    className="bg-black border border-white rounded-full w-50 p-2"/>
                  </div>

                  <div className="">
                    <span>Birthday : </span>
                    <input
                      type="date"
                      name="birthday"
                      id="birthday"
                      className="bg-black border border-white rounded-full w-50 p-2"/>
                  </div>
                </div>

                {/* Phones */}
                <div className="flex flex-auto gap-x-5 gap-y-5 p-5">
                  <div className="">
                  <input
                    type="tel"
                    name="PhoneNumber"
                    id="PhoneNumber"
                    placeholder="Phone Number"
                    className="bg-black border border-white rounded-full w-50 p-2" />
                  </div>
                  <div className="rounded-full">
                  <input 
                    type="tel"
                    name="MobileNumber"
                    id="MobileNumber"
                    placeholder="Mobile Number"
                    className="bg-black border border-white rounded-full w-50 p-2" />
                  </div>
                </div>

                {/* Adress */}
                  <div className="rounded-full gap-x-5 gap-y-5 p-5">
                  <input
                    type="text"
                    name="adress"
                    placeholder="Adress"
                    id="adress"
                    className="bg-black border border-white rounded-full w-50 p-2" />
                  </div>

                {/* Acquisition source */}
                  <div className="gap-x-5 gap-y-5 p-5">
                  <input
                    type="text"
                    name="acquisition_source"
                    id="acquisition_source"
                    placeholder="How did you hear about us?"
                    className="bg-black border border-white rounded-full w-50 p-2" />
                  </div>
                
                {/* Copyright */}
                  <div className="">
                  <span>Right accepted*</span>
                  <input
                    type="checkbox"
                    name="rights_accepted"
                    id="rights_accepted"
                    className="bg-black border border-white rounded-full w-50 p-2" />
                  </div>

                  <div className="">
                  <button
                    type="submit"
                    className="bg-black">
                    next
                  </button>
                  </div>

              </form>
          </section>
          <div className="CopyRight ">
            <span>
              *By submitting this video, you confirm that you hold all necessary rights to the content provided and authorize MarsAI to broadcast, reproduce, and use this video, in whole or in part, in its communications media, without limitation in terms of duration or territory.
            </span>
          </div>

    </div>
  );
};

export default ParticipationSubmission1;