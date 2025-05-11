import React from "react";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

const HomeCategoriesSection = ({categories}) => {
  const navigate=useNavigate();
  const handleSubCatgoryClick=(sub)=>{
    navigate(`/product-subcategory/${sub}`);
  }
  return (
    <div className="w-full px-4 py-2 flex justify-center gap-4 items-center mt-6">
      {categories.map((category) => (
        <div key={category.name} className="relative group">
          <button className="shadow-lg ring-1 font-medium px-5 py-2 rounded-4xl bg-white">
            {category.name}
          </button>
          {/* Dropdown */}
          <div className="absolute left-[10%] top-full mt-0.5 hidden group-hover:flex flex-col bg-white shadow-md rounded-md z-10 min-w-max py-2">
            {category.subcategories.map((sub, idx) => (
              <button
                onClick={()=>handleSubCatgoryClick(sub)}
                key={idx}
                className="px-4 py-2 text-sm text-left hover:bg-gray-100"
              >
                {sub}
              </button>
            ))}
          </div>
          
        </div>
      ))}

    </div>
  );
};

export default HomeCategoriesSection;
