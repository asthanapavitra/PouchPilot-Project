import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLocation } from "react-router-dom";

const ProductDetails = () => {
  const [selectedSize, setSelectedSize] = useState(null);
  const location = useLocation();
  const product = location.state?.product;
  

  return (
    <div className="w-full min-h-screen bg-white text-black overflow-hidden">
      <Navbar />
      <div className="w-full h-full pt-[65px]">
        <div className="relative h-full max-w-8xl mx-auto py-10 px-6 md:px-10 flex flex-col md:flex-row items-center md:items-start gap-12 backdrop-blur-md">
          <div className="w-full md:w-1/2 block sticky top-[65px] z-10">
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              loop
              className="rounded-2xl shadow-xl"
            >
              {product.images.map((img, idx) => (
                <SwiperSlide key={idx}>
                  <img
                    src={img}
                    alt={`Product ${idx}`}
                    className="rounded-xl object-cover w-full h-[300px] sm:h-[400px] md:h-[500px]"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="w-full md:w-1/2 space-y-6">
            <h1 className="text-4xl font-bold">{product.name}</h1>
            
            <p className="text-gray-700">{product.shortDescription}</p>
            {product.size && product.size.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Select Size</h3>
                <div className="flex gap-3 flex-wrap">
                  {product.size.map((sz, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-4 py-2 border rounded-lg transition ${
                        selectedSize === sz
                          ? "bg-black text-white border-black"
                          : "bg-white text-black border-gray-300 hover:border-black"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition">
                Shop Now
              </button>
              <button className="border border-black text-black px-6 py-2 rounded-lg hover:bg-black hover:text-white transition">
                <i className="ri-heart-line text-2xl"></i>
              </button>
            </div>

            {/* Show Information without Dropdown */}
            <div className="mt-6 space-y-4">
              {/* Product Details */}
              <div>
                <h3 className="text-lg font-semibold">Product Details</h3>
                <ul className="mt-2 text-sm text-gray-700 list-disc list-inside">
                  {product.productDetails.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
              </div>

              {/* How It's Made */}
              {product.howMade?
              <div>
                <h3 className="text-lg font-semibold">
                  How This Product Was Made
                </h3>
                <p className="mt-2 text-sm text-gray-700 whitespace-pre-line">
                  {product.howMade}
                </p>
              </div>
:""}
              {/* Delivery & Returns */}
              {product.deliveryAndReturns? <div>
                <h3 className="text-lg font-semibold">Delivery & Returns</h3>
                <p className="mt-2 text-sm text-gray-700 whitespace-pre-line">
                  {product.deliveryAndReturns}
                </p>
              </div>:""}
              

              {/* Reviews
              <div>
                <h3 className="text-lg font-semibold">
                  Reviews
                  <span className="text-yellow-500">
                    {"★".repeat(Math.round(product.rating || 0)) +
                      "☆".repeat(5 - Math.round(product.rating || 0))}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({product.reviews.length})
                  </span>
                </h3>
                {product.reviews.length > 0 ? (
                  <div className="mt-3 space-y-4">
                    {product.reviews.map((review, index) => (
                      <div
                        key={index}
                        className="border p-3 rounded-md shadow-sm"
                      >
                        <div className="flex items-center gap-2 text-sm text-yellow-500">
                          {"★".repeat(Math.round(review.rating)) +
                            "☆".repeat(5 - Math.round(review.rating))}
                        </div>
                        <p className="text-sm mt-1">{review.review}</p>
                        {review.images && review.images.length > 0 && (
                          <div className="flex gap-2 mt-2">
                            {review.images.map((img, i) => (
                              <img
                                key={i}
                                src={img}
                                alt={`Review ${index} Image ${i}`}
                                className="h-16 w-16 object-cover rounded"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-gray-500">No reviews yet.</p>
                )}
              </div> */}</div>
          
          </div>
        </div>
        {/* Complete the Look Section */}
        <div className="max-w-7xl mx-auto px-6 md:px-10 pb-20">
          <h2 className="text-2xl font-semibold mb-6">Complete the Look</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                name: "Tech Fleece Joggers",
                price: 2299,
                image: "/Products/watch.jpeg",
              },
              {
                name: "Urban Utility Sling Bag",
                price: 1899,
                image: "/Products/classic tote bag.jpeg",
              },
              {
                name: "Essential Cotton Tee",
                price: 1299,
                image: "/Products/tshirt.jpeg",
              },
              {
                name: "Core Sports Socks",
                price: 499,
                image: "/Products/sunglasses.jpeg",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="relative group overflow-hidden rounded-xl shadow hover:shadow-xl transition"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-64 object-cover transform group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-center items-center text-white px-4 text-center">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-sm mt-1">₹{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* You Might Also Like Section */}
        <div className="max-w-7xl mx-auto px-6 md:px-10 pb-10">
          <h2 className="text-2xl font-semibold mb-3">You Might Also Like</h2>
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            loop
            spaceBetween={20}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
          >
            {[
              {
                name: "Nike Utility Bag",
                brand: "Nike",
                price: 1999,
                image: "/Products/sneakers.jpeg",
              },
              {
                name: "Nike Air Hoodie",
                brand: "Nike",
                price: 2799,
                image: "/Products/hoodie.jpeg",
              },
              {
                name: "Nike Sports Jacket",
                brand: "Nike",
                price: 3499,
                image: "/Products/jacket.jpeg",
              },
              {
                name: "Nike Air Hoodie",
                brand: "Nike",
                price: 2799,
                image: "/Products/hoodie.jpeg",
              },
            ].map((item, index) => (
              <SwiperSlide key={index}>
                <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-xl transition">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-60 object-cover rounded-lg"
                  />
                  <h3 className="mt-4 font-semibold text-lg">{item.name}</h3>
                  <p className="text-gray-600 text-sm">Brand: {item.brand}</p>
                  <p className="font-bold text-black mt-1">₹{item.price}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default ProductDetails;
