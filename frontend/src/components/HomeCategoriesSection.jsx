import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

const Dropdown = ({ items, position, onClose, onItemClick }) => {
  return createPortal(
    <div
      className="absolute bg-white shadow-md rounded-md z-50 py-2 w-48"
      style={{ top: position.top, left: position.left }}
    >
      {items.map((sub, idx) => (
        <button
          key={idx}
          onClick={() => {
            onItemClick(sub);
            onClose();
          }}
          className="px-4 py-2 text-sm text-left hover:bg-gray-100 w-full"
        >
          {sub}
        </button>
      ))}
    </div>,
    document.body
  );
};

const HomeCategoriesSection = ({ categories }) => {
  const navigate = useNavigate();
  const [openCategory, setOpenCategory] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const buttonRefs = useRef({});

  const handleSubCatgoryClick = (sub) => {
    navigate(`/product-subcategory/${sub}`);
  };

  const handleCategoryClick = (categoryName) => {
    if (openCategory === categoryName) {
      setOpenCategory(null);
    } else {
      const buttonRect = buttonRefs.current[categoryName]?.getBoundingClientRect();
      if (buttonRect) {
        setDropdownPosition({
          top: buttonRect.bottom + window.scrollY,
          left: buttonRect.left + window.scrollX,
        });
      }
      setOpenCategory(categoryName);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      const isInsideButton = Object.values(buttonRefs.current).some((ref) =>
        ref?.contains(e.target)
      );
      if (!isInsideButton) {
        setOpenCategory(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`w-full px-4 py-2 flex ${window.innerWidth>=768 && "justify-center "}  gap-4 items-center mt-6 overflow-x-auto`}>
      {categories.map((category) => (
        <div key={category.name} className="relative">
          <button
            ref={(el) => (buttonRefs.current[category.name] = el)}
            onClick={() => handleCategoryClick(category.name)}
            onMouseEnter={() => handleCategoryClick(category.name)}
          
            className="shadow-lg ring-1 font-medium px-5 py-2 rounded-4xl bg-white "
          >
            {category.name}
          </button>
        </div>
      ))}

      {openCategory && (
        <Dropdown
          items={
            categories.find((cat) => cat.name === openCategory)?.subcategories || []
          }
          position={dropdownPosition}
          onClose={() => setOpenCategory(null)}
          onItemClick={handleSubCatgoryClick}
          
        />
      )}
    </div>
  );
};

export default HomeCategoriesSection;
