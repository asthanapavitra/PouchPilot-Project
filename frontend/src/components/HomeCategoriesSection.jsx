import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const HomeCategoriesSection = ({ categories }) => {
  const navigate = useNavigate();
  const [openCategory, setOpenCategory] = useState(null);
  const containerRef = useRef(null);

  const handleSubCatgoryClick = (sub) => {
    navigate(`/product-subcategory/${sub}`);
    setOpenCategory(null); // close dropdown after selection
  };

  const handleCategoryClick = (categoryName) => {
    setOpenCategory((prev) => (prev === categoryName ? null : categoryName));
  };

  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpenCategory(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={`w-full px-4 py-2 flex justify-center gap-4 items-center mt-6  `}
      ref={containerRef}
    >
      {categories.map((category) => (
        <div key={category.name} className="relative group">
          <button
            onClick={() => handleCategoryClick(category.name)}
            className="shadow-lg ring-1 font-medium px-5 py-2 rounded-4xl bg-white"
          >
            {category.name}
          </button>

          {/* Dropdown */}
          <div
            className={`absolute left-[10%] top-full mt-0.5 ${
              openCategory === category.name ? "flex" : "hidden"
            } group-hover:flex flex-col bg-white shadow-md rounded-md z-10 min-w-max py-2 `}
          >
            {category.subcategories.map((sub, idx) => (
              <button
                key={idx}
                onClick={() => handleSubCatgoryClick(sub)}
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
