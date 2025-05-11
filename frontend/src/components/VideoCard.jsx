import React, { useState } from 'react'

const VideoCard = (props) => {
      const [isMuted, setIsMuted] = useState(true);
      const togglePlay = () => {
        const video = document.querySelector("video");
        isMuted ? (video.muted = false) : (video.muted = true);
        setIsMuted(!isMuted);
      };
    
  return (
    <div className="w-full h-[80%]  relative">
        <video
          className="rounded-xl w-full h-full object-cover"
          src={props.videoSrc}
          loop
          autoPlay
          muted={isMuted}
        >
          Your browser does not support the video tag.
        </video>
        <button onClick={togglePlay} className="">
          {isMuted ? (
            <i className="ri-volume-mute-line text-2xl  text-white absolute bottom-8 right-6"></i>
          ) : (
            <i class="ri-volume-down-line text-2xl text-white absolute bottom-8 right-6"></i>
          )}
        </button>
      </div>

  )
}

export default VideoCard;