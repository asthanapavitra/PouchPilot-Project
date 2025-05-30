import React, { useState } from "react";
import VideoCard from "./VideoCard";

const VideoContentCard = (props) => {

  return (
    <div className={`flex flex-col md:flex-row ${props.align=="right"?"md:flex-row-reverse":""}
     items-center gap-6 justify-evenly pb-4 bg-white h-full  w-[100%] `}>
      {/* Left: Video */}
      <div className="w-[100%] ">
      <VideoCard videoSrc={props.videoSrc}/>
      </div>
     
      {/* Right: Text Content */}
      {/* <div className="w-full md:w-[50%] text-center">
        <h2 className="text-2xl font-bold mb-3">{props.highlight.heading}</h2>
        <p className="text-gray-600 mb-4 tracking-tight">
        {props.highlight.description}
        </p>
        <button className="bg-black text-white px-5 py-2 rounded-lg hover:bg-black/90 transition-all">
          Shop Now
        </button>
      </div> */}
    </div>
  );
};

export default VideoContentCard;
