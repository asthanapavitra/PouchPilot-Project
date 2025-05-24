import React, { useState } from "react";

const AdminProductCard = ({ product }) => {
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

  return (
    <div className="w-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex flex-col items-center text-center">
      {/* Image Carousel */}
      <div className="relative w-full h-48 overflow-hidden rounded-xl mb-4">
        {imageSrc && (
          <img
            src={imageSrc}
            alt="product"
            className="object-contain w-full h-full"
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

      {/* Product Info */}
      <h3 className="font-semibold text-lg">{product.name}</h3>
      <p className="text-sm text-gray-600 mb-2">{product.shortDescription}</p>
      <div className="text-md font-medium mb-2">
        ₹{product.price}{" "}
        {product.discount > 0 && (
          <span className="text-red-500 text-sm ml-2">
            ({product.discount}% off)
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-3">
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm">
          Update Product
        </button>
        <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm">
          Delete Product
        </button>
      </div>
    </div>
  );
};

export default AdminProductCard;
