import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ParticipationPersonnalData = ({setEtape}) => {
  const navigate = useNavigate();

  return (
    <div className="border border-white bg-[#1B1F29] rounded-xl p-2 text-center ">
      <h2 className="p-2">Personnal Data</h2>
        <div className="text-center flex flex-raw space-between justify-center gap-2">
          
          <div className="border rounded-xl w-5  bg-purple-500/100">
            1
          </div>
          <div className="border rounded-xl w-5">
            2
          </div>
          <div className="border rounded-xl w-5">
            3
          </div>
        </div>
          <section className="FormContainer">
            <form action="" method="post" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center m-5 gap-5">

            {/* Civility */}
                <div className="">
                  <select name="Gender" id="Gender" className="bg-black/50 border rounded-xl p-2 w-60">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                  <div >
                  <input className="bg-black/50 border rounded-xl p-2 gap-5 w-60"
                    type="text"
                    name="FirstName"
                    id="FirstName"
                    label="FirstName"
                    placeholder="First Name"
                    />
                  </div>

                  <div>
                  <input className="bg-black/50 border rounded-xl p-2 gap-5 w-60"
                    type="text"
                    name="LastName"
                    id="LastName"
                    placeholder="Last Name"
                    />
                  </div>

                {/* Email & Birthday */}
                  <div>
                  <input className="bg-black/50 border rounded-xl p-2 w-60"
                    type="email"
                    name="email"
                    id="email"
                    placeholder="email"
                    />
                  </div>

                  <div >
                    <input className="bg-black/50 border rounded-xl p-2 gap-5 w-60"
                      type="date"
                      name="birthday"
                      id="birthday"
                      />
                  </div>

                  <div>
                  <input className="bg-black/50 border rounded-xl p-2 gap-5 w-60"
                    type="text"
                    name="Country"
                    id="Country"
                    label="Country"
                    placeholder="Country"
                    />
                  </div>

                {/* Phones */}
                  <div>
                  <input className="bg-black/50 border rounded-xl p-2 w-60"
                    type="tel"
                    name="PhoneNumber"
                    id="PhoneNumber"
                    placeholder="Phone Number"
                    />
                  </div>

                  <div>
                  <input className="bg-black/50 border rounded-xl p-2 w-60"
                    type="tel"
                    name="MobileNumber"
                    id="MobileNumber"
                    placeholder="Mobile Number"
                    />
                  </div>

                {/* Adress */}
                  <div>
                  <input className="bg-black/50 border rounded-xl p-2 w-60"
                    type="text"
                    name="adress"
                    placeholder="Adress"
                    id="adress"
                    />
                  </div>

                {/* Acquisition source */}
                  <div>
                  <input className="bg-black/50 border rounded-xl p-2 w-60"
                    type="text"
                    name="acquisition_source"
                    id="acquisition_source"
                    placeholder="How did you hear about us?"
                    />
                  </div>
                
                {/* Button */}
                  <div className="m-5 p-1 gap-5">
                  <button onClick={() => setEtape(2)}
                    type="submit"
                    className="bg-linear-65 from-purple-500 to-pink-500 border rounded-xl p-2 w-25">
                    Next
                  </button>
                  </div>

              </form>
          </section>


    </div>
  );
};

export default ParticipationPersonnalData;