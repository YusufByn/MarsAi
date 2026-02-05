import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isValidPhoneNumber } from "libphonenumber-js";

const ParticipationPersonnalData = ({setEtape}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Gender: '',
    FirstName: '',
    LastName: '',
    email: '',
    birthday: '',
    country: '',
    phoneNumber: '',
    mobileNumber: '',
    acquisitionSource: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // validation de l'email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // validation des numéros de téléphone
  const validatePhone = (phoneNumber) => {
    const isValid =  isValidPhoneNumber(phoneNumber);
  };

  return (
    <div className="border border-white/10 bg-[#050505] rounded-xl p-2 text-center ">
      <h2 className="p-2">Personnal Data</h2>
        <div className="text-center flex flex-raw space-between justify-center gap-2">
          
          <div className="border rounded-xl w-5  bg-purple-500">
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
            <form method="post" className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 justify-items-center m-5 gap-5">

            {/* Civility */}
                <div className="gender ">
                  <select name="gender"
                  id="gender"
                  value={formData.gender}
                  // onChange={handleChange}
                  className="bg-black/50 border rounded-xl p-2 w-60"
                  >
                   <option value="">Select your gender</option>
                   <option value="women">Women</option>
                   <option value="man">Man</option>
                   <option value="other">Other</option>
                  </select>
                </div>

                  <div >
                  <input className="bg-black/50 border rounded-xl p-2 gap-5 w-60"
                    type="text"
                    name="firstName"
                    id="firstName"
                    label="firstName"
                    placeholder="First Name"
                    />
                  </div>

                  <div>
                  <input className="bg-black/50 border rounded-xl p-2 gap-5 w-60"
                    type="text"
                    name="lastName"
                    id="lastName"
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
                    id="country"
                    label="country"
                    placeholder="Country"
                    />
                  </div>

                {/* Phones */}
                  <div>
                  <input className="bg-black/50 border rounded-xl p-2 w-60"
                    type="tel"
                    name="phoneNumber"
                    id="phoneNumber"
                    placeholder="Phone Number"
                    />
                  </div>

                  <div>
                  <input className="bg-black/50 border rounded-xl p-2 w-60"
                    type="tel"
                    name="mobileNumber"
                    id="mobileNumber"
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
                    name="acquisitionSource"
                    id="acquisitionSource"
                    placeholder="How did you hear about us?"
                    />
                  </div>
                
                <div>
                </div>
                {/* Button */}
                  <div className="m-5 p-1 gap-5 place-self-centered">
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