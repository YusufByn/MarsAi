import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ParticipationVideoUpload = () => {
  const navigate = useNavigate();

  return (
    <div className="border border-white bg-[#1B1F29] rounded-xl p-2 text-center">
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
        </div>
          <section className="FormContainer">
            <form action="" method="post" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-center">

                <div className="place-self-center">
                  <div className="">
                    <input className="justify-items-center bg-black/50 border rounded-xl p-2 gap-5 w-60"
                      type="text"
                      name="Youtube URL"
                      id="Youtube_URL"
                      label="Youtube URL"
                      placeholder="Youtube URL"
                      />
                  </div>
                </div>

                  <div className="grid grid-cols-1 justify-items-center m-1 gap-1">
                    <div>
                    <span>Send your video</span>
                    </div>
                    <div>
                      PLACE_HOLDER : VIDEO DURATION
                    </div>
                    <input className="border border-white bg-[#8052DB] rounded-xl p-2 text-center w-25"
                    type="file"
                    accept=".MOV, .MPEG4, .MP4, .AVI, .WMV, .MPEGPS, .FLV, .3GPP, .WebM."
                    name="video file name"
                    id="video_file_name"
                    label="video file"
                    />
                    <div className="bg-black/50 border rounded-xl p-2 m-1 gap-1 w-25">
                      <button type="submit">Send</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 justify-items-center m-1 gap-1">
                    <div>
                    <span>Send the cover of the video</span>
                    </div>
                    <div className="border border-white m-1 p-1 gap-1">
                      PLACE_HOLDER IMG PREVIEW COVER
                    </div>
                    <input className="border border-white bg-[#8052DB] rounded-xl p-2 text-center w-25"
                    type="file"
                    accept="image/*"
                    name="cover file name"
                    id="cover_file_name"
                    label="cover file"
                    />
                    <div className="bg-black/50 border rounded-xl p-2 m-1 gap-5 w-25">
                      <button type="submit">Send</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 justify-items-center m-1 gap-5">
                    <div>
                    <span>Send the still 1 of the video</span>
                    </div>
                    <div className="border border-white m-1 p-1 gap-1">
                      PLACE_HOLDER IMG PREVIEW STILL 1
                    </div>
                    <input className="border border-white bg-[#8052DB] rounded-xl p-2 text-center w-25"
                    type="file"
                    accept="image/*"
                    name="still1"
                    id="still1"
                    label="still1"
                    />
                    <div className="bg-black/50 border rounded-xl p-2 m-1 gap-5 w-25">
                      <button type="submit">Send</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 justify-items-center m-1 gap-5">
                    <div>
                    <span>Send the still 2 of the video</span>
                    </div>
                    <div className="border border-white m-1 p-1 gap-1">
                      PLACE_HOLDER IMG PREVIEW STILL 2
                    </div>
                    <input className="border border-white bg-[#8052DB] rounded-xl p-2 text-center w-25"
                    type="file"
                    accept="image/*"
                    name="still2"
                    id="still2"
                    label="still2"
                    />
                    <div className="bg-black/50 border rounded-xl p-2 m-1 gap-5 w-25">
                      <button type="submit">Send</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 justify-items-center m-1 gap-5">
                    <div>
                    <span>Send the still 3 of the video</span>
                    </div>
                    <div className="border border-white m-1 p-1 gap-1">
                      PLACE_HOLDER IMG PREVIEW STILL 3
                    </div>
                    <input className="border border-white bg-[#8052DB] rounded-xl p-2 text-center w-25"
                    type="file"
                    accept="image/*"
                    name="still3"
                    id="still3"
                    label="still3"
                    />
                    <div className="bg-black/50 border rounded-xl p-2 m-1 gap-5 w-25">
                      <button type="submit">Send</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 justify-items-center m-1 gap-5">
                    <div>
                    <span>Send the subtitle of the video</span>
                    </div>
                    <input className="border border-white bg-[#8052DB] rounded-xl p-2 text-center w-25"
                    type="file"
                    accept=".srt"
                    name="srt"
                    id="srt"
                    label="srt"
                    />
                    <div className="bg-black/50 border rounded-xl p-2 m-1 gap-5 w-25">
                      <button type="submit">Send</button>
                    </div>
                  </div>

                {/* Copyright */}
                <div>
                  <div className="m-1 p-1 gap-5">
                  <span>Right accepted*</span>
                  <input
                    type="checkbox"
                    name="rights_accepted"
                    id="rights_accepted"
                    className="" />
                  </div>
                  <div className="CopyRight">
                    <span>
                      *By submitting this video, you confirm that you hold all necessary rights to the content provided and authorize MarsAI to broadcast,
                      reproduce, and use this video, in whole or in part, in its communications media, without limitation in terms of duration or territory.
                    </span>
                  </div>
                </div>

                  <div className="m-1 p-1 gap-5  ">
                  <button
                    type="submit"
                    className="bg-linear-65 from-purple-500 to-pink-500 border rounded-xl p-1 m-1 w-25 ">
                    Submit
                  </button>
                  </div>

              </form>
          </section>


    </div>
  );
};

export default ParticipationVideoUpload;