import React from "react";
import { useNavigate } from "react-router-dom";

const CategoryCard = ({ category ,categories}) => {
  const navigate=useNavigate();
  return (
    <div className="relative mb-5 p-2 pt-4 ">
      <div
      onClick={()=>{
        navigate(`/category-products/${category.name}`,{state:{categories:categories}})
      }}
        className="w-full h-full p-5 mb-2 flex justify-center items-center"
        style={{
          backgroundImage: "linear-gradient(to top, #9795f0 0%, #fbc8d4 100%)",
        }}
      >
        <img
          className="max-w-full h-auto object-contain"
          src={category.image}
          alt=""
        />
      </div>

      <p className="text-center font-medium text-md ">{category.name}</p>
    </div>
  );
};

export default CategoryCard;
