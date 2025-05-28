import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

// Dropdown component using React portal
const Dropdown = ({ items, position, onItemClick }) => {
  return createPortal(
    <div
      className="absolute bg-white shadow-md rounded-md z-50 py-2 w-48 dropdown-portal"
      style={{ top: position.top, left: position.left }}
    >
      {items.map((sub, idx) => (
        <button
          key={idx}
          onClick={() => {
            console.log("Clicked subcategory:", sub);
            onItemClick(sub);
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

// Main HomeCategoriesSection component
const HomeCategoriesSection = ({ categories }) => {
  const navigate = useNavigate();
  const [openCategory, setOpenCategory] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const buttonRefs = useRef({});

  const handleSubCatgoryClick = (sub) => {
    navigate(`/product-subcategory/${sub}` ,{state:{categories:categories}});
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

  // Close dropdown on outside click, with slight delay to allow clicks to register
  useEffect(() => {
    const handleClickOutside = (e) => {
      setTimeout(() => {
        const isInsideButton = Object.values(buttonRefs.current).some((ref) =>
          ref?.contains(e.target)
        );
        const dropdownEl = document.querySelector(".dropdown-portal");
        const isInsideDropdown = dropdownEl?.contains(e.target);

        if (!isInsideButton && !isInsideDropdown) {
          setOpenCategory(null);
        }
      }, 100); // small delay
    };

    document.addEventListener("mouseup", handleClickOutside);
    return () => document.removeEventListener("mouseup", handleClickOutside);
  }, []);

  return (
    <div
      className={`w-full px-4 py-2 flex ${
        window.innerWidth >= 768 && "justify-center"
      } gap-4 items-center mt-6 overflow-x-auto`}
    >
      {categories.map((category) => (
        <div key={category.name} className="relative">
          <button
            ref={(el) => (buttonRefs.current[category.name] = el)}
            onClick={() => handleCategoryClick(category.name)}
            className="shadow-lg ring-1 font-medium px-5 py-2 rounded-4xl bg-white"
          >
            {category.name}
          </button>
        </div>
      ))}

      {openCategory && (
        <Dropdown
          items={
            categories.find((cat) => cat.name === openCategory)?.subcategories ||
            []
          }
          position={dropdownPosition}
          onItemClick={handleSubCatgoryClick}
        />
      )}
    </div>
  );
};

export default HomeCategoriesSection;
