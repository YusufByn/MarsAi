import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ParticipationVideoData = ({setEtape}) => {
  const navigate = useNavigate();

  return (
    <div className="border border-white bg-[#1B1F29] rounded-xl p-2 text-center">
      <h2 className="p-2">Video Data</h2>
        <div className="text-center flex flex-raw space-betweenb justify-center gap-2">
          
          <div className="border rounded-xl w-5">
            1
          </div>
          <div className="border rounded-xl w-5 bg-purple-500/100">
            2
          </div>
          <div className="border rounded-xl w-5">
            3
          </div>
        </div>
          <section className="FormContainer">
            <form action="" method="post" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center m-5 gap-5 ">

                  <div>
                  <input className="bg-black/50 border rounded-xl p-2 gap-5 w-60"
                    type="text"
                    name="Title"
                    id="Title"
                    label="Title"
                    placeholder="Title"
                    />
                  </div>
                  <div>
                  <input className="bg-black/50 border rounded-xl p-2 gap-5 w-60"
                    type="text"
                    name="Title EN"
                    id="Title EN"
                    label="Title EN"
                    placeholder="Title EN"
                    />
                  </div>
                  <div>
                  <input className="bg-black/50 border rounded-xl p-2 gap-5 w-60"
                    type="text"
                    name="Language"
                    id="Language"
                    label="Language"
                    placeholder="Language"
                    />
                  </div>
                  <div>
                  <textarea className="bg-black/50 border rounded-xl p-2 gap-5 w-60"
                    type="text"
                    name="Synopsis"
                    id="Synopsis"
                    label="Synopsis"
                    placeholder="Synopsis"
                    />
                  </div>
                  <div>
                  <textarea className="bg-black/50 border rounded-xl p-2 gap-5 w-60"
                    type="text"
                    name="Synopsis EN"
                    id="Synopsis EN"
                    label="Synopsis EN"
                    placeholder="Synopsis EN"
                    />
                  </div>
                  <div>
                  <textarea className="bg-black/50 border rounded-xl p-2 gap-5 w-60"
                    type="text"
                    name="Tech Resume"
                    id="Tech Resume"
                    label="Tech Resume"
                    placeholder="Tech Resume"
                    />
                  </div>
                  <div >
                  <textarea className="bg-black/50 border rounded-xl p-2 gap-5 w-60"
                    type="text"
                    name="Creative Resume"
                    id="Tech Resume"
                    label="Tech Resume"
                    placeholder="Creative Resume"
                    />
                  </div>
                    <div className="p-2 g-2 m-2 w-60">
                    <input className="bg-black/50 border rounded-xl m-5 p-2 gap-5"
                      type="radio"
                      name="Classification"
                      id="Classification"
                      label="Classification"
                      />
                      Hybride
                    <input className="bg-black/50 border rounded-xl m-5 p-2 gap-5"
                      type="radio"
                      name="Classification"
                      id="Classification"
                      label="Classification"
                      />
                      Full AI
                    </div>
                  <div className="Tag PlaceHolder bg-black/50 border rounded-xl p-2 gap-5 w-60">
                    <input
                    type="text"
                    name="Tag"
                    id="Tag"
                    placeholder="Tags (PLACE HOLDER)"
                    />
                  </div>

                  <div>
                  </div>
                  <div>
                  </div>
                  <div className="m-5 p-1 gap-5 place-self-centered">
                  <button onClick={() => setEtape(3)}
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

export default ParticipationVideoData;