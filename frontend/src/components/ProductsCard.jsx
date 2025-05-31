import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProductsCard = ({ product }) => {

  const navigate = useNavigate();
  const [colorIndex, setColorIndex] = useState(0);
    const [imgIndex, setImgIndex] = useState(0);
  
    const currentGallery = product.images?.[colorIndex]?.gallery || [];
   const nextImage = () => {
    if (imgIndex === currentGallery.length - 1) {
      setImgIndex(0);
      setColorIndex((colorIndex) => (colorIndex + 1) % product.images.length);
    } else setImgIndex((prev) => (prev + 1) % currentGallery.length);
  };

  const prevImage = () => {
    if (imgIndex === 0) {
      setColorIndex(
        (colorIndex) =>
          (colorIndex - 1 + product.images.length) % product.images.length
      );

      setImgIndex(currentGallery.length - 1);
    } else
      setImgIndex(
        (prev) => (prev - 1 + currentGallery.length) % currentGallery.length
      );
  };

  const currentImage = currentGallery[imgIndex];

  const imageSrc = currentImage;
  const handleAddToCart = async () => {
    try {
      let response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/users/add-to-cart/${product._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        alert("Item added to cart successfully");
      }
    } catch (err) {
      if (err.response) {
        console.error("Error Response:", err.response.data); // Log full error response
        console.error("Status:", err.response.status); // Log the status code

        // Handle errors based on status codes
        if (err.response.status === 400 || err.response.status === 401) {
          const errorMessages = err.response.data.errors
            ?.map((error) => error.message)
            .join("\n");
          console.log(errorMessages);
          alert(errorMessages); // Show error messages to the user
        }
      } else {
        console.error("Error:", err.message); // Log network or other errors
      }
    }
  };
  const handleProductClick = () => {
    navigate(`/product-details/${product._id}`, { state: { product } });
  };

  return (
    <div className="   mx-auto px-2 py-2  w-[100%] flex flex-col items-center justify-between bg-white rounded-2xl hover:shadow-2xl transition-all duration-300 translate-y-4 ">
      {/* Product Image */}
      <div 
        
        className=" w-[100%] cursor-pointer flex flex-col items-center justify-between bg-white rounded-2xl transition-all duration-300 translate-y-4"
      >
        <div className="relative w-full h-48 overflow-hidden rounded-xl mb-4">
        {imageSrc && (
          <img onClick={handleProductClick}
            src={imageSrc.src}
            alt="product"
            className={`w-[80%] h-50 object-center rounded-xl mb-7 mx-4 mt-2  transition-all duration-300`}
          />
        )}
        {currentGallery.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2  text-gray-200 px-2 py-1 rounded-full text-5xl"
            >
              ‹
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2   text-gray-200 px-2 py-1 rounded-full text-5xl"
            >
              ›
            </button>
          </>
        )}
      </div>
       
        {/* Product Name */}
        <h2 onClick={handleProductClick} className="text-md font-semibold mb-1">{product.name}</h2>

        {/* Price */}
        <p onClick={handleProductClick} className="text-gray-700 text-md mb-3">₹{product.price}</p>
      </div>

      {/* Action Buttons */}
      <div className="w-full flex justify-around items-center">
        <button
          onClick={() => {
            handleAddToCart();
          }}
          className="flex items-center gap-2 px-4 py-2   transition"
        >
          <i className="ri-shopping-cart-2-line text-3xl cursor-pointer"></i>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 cursor-pointer  text-black transition">
          <i className="ri-flashlight-line text-3xl "></i>
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductsCard;
