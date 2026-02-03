import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ParticipationVideoUpload = () => {
  const navigate = useNavigate();

  return (
    <div className="border border-white w-250 bg-[#1B1F29] rounded-xl p-2 text-center">
      <h2 className="p-2">Video Upload</h2>
        <div className="text-center flex flex-raw space-betweenb justify-center gap-2">
          
          <div className="border rounded-xl w-5 ">
            1
          </div>
          <div className="border rounded-xl w-5">
            2
          </div>
          <div className="border rounded-xl w-5 bg-purple-500/100">
            3
          </div>
          <div className="border rounded-xl w-5">
            4
          </div>
        </div>
          <section className="FormContainer">
            <form action="" method="post" className=" justify-center">

            {/* Civility */}
              <div className="flex flex-row m-5 p-1 gap-5">
                <div className="">
                  <select name="Gender" id="Gender" className="bg-black/50 border rounded-xl p-2">
                    <option value="Male" className="bg-sky-500/50">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                  <div >
                  <input className="bg-black/50 border rounded-xl p-1 w-95"
                    type="text"
                    name="FirstName"
                    id="FirstName"
                    label="FirstName"
                    placeholder="First Name"
                    />
                  </div>
                  <div>
                  <input className="bg-black/50 border rounded-xl p-1 w-95"
                    type="text"
                    name="LastName"
                    id="LastName"
                    placeholder="Last Name"
                    />
                  </div>
                </div>

              <div className="flex flex-row">
                {/* Email & Birthday */}
                <div className="flex flex-row m-5 p-1 gap-5">
                  <div>
                  <input className="bg-black/50 border rounded-xl p-1 w-65"
                    type="email"
                    name="email"
                    id="email"
                    placeholder="email"
                    />
                  </div>
                  <div >
                    <input className="bg-black/50 border rounded-xl p-1"
                      type="date"
                      name="birthday"
                      id="birthday"
                      />
                  </div>
                </div>

                {/* Phones */}
                <div className="flex flex-row place-content-between m-5 p-1 gap-5">
                  <div>
                  <input className="bg-black/50 border rounded-xl p-1 w-40"
                    type="tel"
                    name="PhoneNumber"
                    id="PhoneNumber"
                    placeholder="Phone Number"
                    />
                  </div>
                  <div>
                  <input className="bg-black/50 border rounded-xl p-1 w-40"
                    type="tel"
                    name="MobileNumber"
                    id="MobileNumber"
                    placeholder="Mobile Number"
                    />
                  </div>
                </div>
              </div>

                {/* Adress */}
                <div className="flex flex-col m-5 p-1 gap-5">
                  <div>
                  <input className="bg-black/50 border rounded-xl p-1 w-230"
                    type="text"
                    name="adress"
                    placeholder="Adress"
                    id="adress"
                    />
                  </div>

                {/* Acquisition source */}
                  <div>
                  <input className="bg-black/50 border rounded-xl p-1 w-230"
                    type="text"
                    name="acquisition_source"
                    id="acquisition_source"
                    placeholder="How did you hear about us?"
                    />
                  </div>
                </div>

                  <div className="m-5 p-1 gap-5  ">
                  <button
                    type="submit"
                    className="bg-linear-65 from-purple-500 to-pink-500 border rounded-xl p-1 m-1  ">
                    Send
                  </button>
                  </div>

              </form>
          </section>


    </div>
  );
};

export default ParticipationVideoUpload;