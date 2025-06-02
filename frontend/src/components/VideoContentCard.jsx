import React, { useState } from "react";
import VideoCard from "./VideoCard";
import { useNavigate } from "react-router-dom";

const VideoContentCard = (props) => {
  const navigate=useNavigate();
const handleVideoClick=()=>{
  navigate(`/category-products${props.category}`)
}
  return (
    <div onClick={handleVideoClick} className={`flex flex-col relative md:flex-row ${props.align=="right"?"md:flex-row-reverse":""}
     items-center gap-6 justify-evenly pb-4 bg-white h-full  w-[100%] `}>
      {/* Left: Video */}
      <div className="w-[100%] ">
      <VideoCard videoSrc={props.videoSrc}/>
      </div>
     
      {/* Right: Text Content */}
      <div className="absolute text-white text-center w-[80%] p-2 md:w-[65%] bottom-10  md:bottom-4">
        <h2 className="text-sm md:text-lg font-bold mb-3">{props.highlight.heading}</h2>
        {window.innerWidth>=1024 && <p className="text-sm mb-4 tracking-tight">
        {props.highlight.description}
        </p>}
        
      </div>
    </div>
  );
};

export default VideoContentCard;
