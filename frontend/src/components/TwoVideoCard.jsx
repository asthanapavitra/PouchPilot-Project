import React from "react";
import VideoCard from "./VideoCard";

const TwoVideoCard = (props) => {
  return (
    <div className="flex flex-col md:flex-row items-center gap-6 justify-evenly px-10  py-2  bg-white shadow-lg rounded-2xl w-[95%] mx-10  mt-10">
      <div className="w-[50%] ">
      <VideoCard videoSrc={props.videoSrc} />
      <div>
        <h2 className="text-2xl font-bold mb-3">Discover the Latest Trends</h2>
        <p className="text-gray-600 mb-4 tracking-tight">
          Explore our exclusive collection of fashion and lifestyle products.
        </p>
        <div className="w-full flex justify-center items-center">
        <button className="bg-black text-white px-5 py-2 rounded-lg hover:bg-black/90 transition-all " >
          Shop Now
        </button>
        </div>
        
      </div>
      </div>
      <div className="w-[50%]">
      <VideoCard videoSrc={props.videoSrc} />
      <div>
        <h2 className="text-2xl font-bold mb-3">Discover the Latest Trends</h2>
        <p className="text-gray-600 mb-4 tracking-tight">
          Explore our exclusive collection of fashion and lifestyle products.
        </p>
        <div className="w-full flex justify-center items-center">
        <button className="bg-black text-white px-5 py-2 rounded-lg hover:bg-black/90 transition-all " >
          Shop Now
        </button>
        </div>
        
      </div>
      </div>
      
    </div>
  );
};

export default TwoVideoCard;
