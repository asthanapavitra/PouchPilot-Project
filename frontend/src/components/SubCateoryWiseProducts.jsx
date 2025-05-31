import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const SubCateoryWiseProducts = ({product}) => {
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
   const handleProductClick = () => {
    navigate(`/`, { state: { product } });
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
        <h2 onClick={handleProductClick} className="text-md font-semibold mb-1">{product.subcategory}</h2>

       
      </div>

     
    
    </div>
  )
}

export default SubCateoryWiseProducts