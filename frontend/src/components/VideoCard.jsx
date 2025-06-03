import React, { useState } from "react";

const VideoCard = (props) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const toggleMute = () => {
    const video = document.querySelector("video");
    isMuted ? (video.muted = false) : (video.muted = true);
    setIsMuted(!isMuted);
  };
  const togglePlay = () => {
    const video = document.querySelector("video");
    if (isPlaying) {
      video.pause(); // call pause method
    } else {
      video.play(); // call play method
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div
      className={`w-full ${
        window.innerWidth <= 768 ? "h-[60vh]" : "h-full "
      }  `}
    >
      <video
        onClick={() => {
          props.handleVideoClick();
        }}
        className=" w-full h-full object-cover"
        src={props.videoSrc}
        loop
        autoPlay
        categories={props.categories}
        muted={isMuted}
      >
        Your browser does not support the video tag.
      </video>
      <div className="flex  gap-4 ">
        <button onClick={togglePlay} className="">
          {isPlaying ? (
            <i className="ri-pause-line text-2xl absolute bottom-4 left-15  text-white "></i>
          ) : (
            <i class="ri-play-line text-2xl absolute bottom-4 left-15  text-white "></i>
          )}
        </button>
        <button onClick={toggleMute} className="">
          {isMuted ? (
            <i className="ri-volume-mute-line text-2xl absolute bottom-4 right-15  text-white "></i>
          ) : (
            <i class="ri-volume-down-line text-2xl absolute bottom-4 right-15  text-white"></i>
          )}
        </button>
      </div>
    </div>
  );
};

export default VideoCard;
