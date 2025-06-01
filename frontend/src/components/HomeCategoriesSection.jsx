import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

// Main HomeCategoriesSection component
const HomeCategoriesSection = ({ categories }) => {
  const navigate = useNavigate();

  const buttonRefs = useRef({});

  const handleCategoryClick = (categoryName) => {
    navigate(`/product-category/${categoryName}`, {
      state: { categories: categories },
    });
  };

  return (
    <div
      className={`w-full px-4 py-2 flex ${
        window.innerWidth >= 768 && "justify-center"
      } gap-4 items-center mt-2 overflow-x-auto whitespace-nowrap flex-nowrap scrollbar-hide`}
    >
      {categories.map((category) => (
        <div key={category.name} className="relative">
          <button
            ref={(el) => (buttonRefs.current[category.name] = el)}
            onClick={() => handleCategoryClick(category.name)}
            className="ring-1 font-medium px-5 py-2 rounded-3xl bg-white hover:-translate-y-1 transition-transform duration-200"
          >
            {category.name}
          </button>
        </div>
      ))}
    </div>
  );
};

export default HomeCategoriesSection;
