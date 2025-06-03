import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ChevronDown, ChevronUp } from "lucide-react";

const ProductSpecifications = ({ specifications }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full border-b border-gray-300 py-2">
      <div
        className="flex items-center justify-between cursor-pointer  py-2 hover:bg-gray-100"
        onClick={() => setOpen(!open)}
      >
        <h2 className="text-lg font-semibold">Specifications</h2>
        {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>

      {open && (
        <div className="px-4 py-2 space-y-3">
          {specifications.map((spec, index) =>
            spec.subHeading !== "" && spec.value !== "" ? (
              <div key={index} className="flex justify-between pb-2">
                <span className="text-sm text-gray-600">{spec.subHeading}</span>
                <span className="text-sm font-medium text-gray-900">
                  {spec.value}
                </span>
              </div>
            ) : null
          )}
        </div>
      )}
    </div>
  );
};
const ProductDetails = () => {
  const [selectedSize, setSelectedSize] = useState(null);
  const location = useLocation();
  const product = location.state?.product;
  const navigate = useNavigate();

  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupProgress, setPopupProgress] = useState(100);

  const [selectedColor, setSelectedColor] = useState(
    product.images?.[0]?.color || ""
  );
  // Parse the delivery string (e.g., "7 days")
  const deliveryDays = parseInt(product.delivery); // gets 7 from "7 days"

  // Calculate estimated delivery date
  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + deliveryDays);

  // Format the date (e.g., "Jun 7, 2025")
  const options = { year: "numeric", month: "short", day: "numeric" };
  const formattedDate = estimatedDate.toLocaleDateString(undefined, options);

  const showPopupMessage = (message) => {
    setPopupMessage(message);
    setPopupProgress(100);
    setShowPopup(true);

    let width = 100;
    const interval = setInterval(() => {
      width -= 1;
      setPopupProgress(width);
      if (width <= 0) {
        setShowPopup(false);
        clearInterval(interval);
      }
    }, 25);
  };

  const handleShopNow = async () => {
    if (!selectedSize) {
      alert("Please select a size before proceeding.");
      return;
    }

    navigate("/order-place", {
      state: {
        productId: product._id,
        selectedColor,
        selectedSize,
      },
    });
  };
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
        showPopupMessage("Item added to cart successfully");
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
          showPopupMessage(errorMessages); // Show error messages to the user
        }
      } else {
        console.error("Error:", err.message); // Log network or other errors
      }
    }
  };
  const handleAddToWishList = async () => {
    try {
      let response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/users/add-to-wishlist/${product._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        showPopupMessage("Item added to wishilist successfully");
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
          showPopupMessage(errorMessages); // Show error messages to the user
        }
      } else {
        console.error("Error:", err.message); // Log network or other errors
      }
    }
  };
  const getGalleryForSelectedColor = () => {
    return (
      product.images.find((img) => img.color === selectedColor)?.gallery || []
    );
  };

  const gallery = getGalleryForSelectedColor();
  return (
    <div className="w-full min-h-screen bg-white text-black overflow-hidden relative">
      <Navbar />
      {showPopup && (
        <div
          className="absolute top-[75px] right-[5%] w-full flex justify-center mt-2 z-50"
          onClick={() => {
            if (popupMessage.includes("Click here to buy item")) {
              navigate("/my-cart");
            }
          }}
        >
          <div className="fixed top-[70px] z-999 bg-blue-100 text-black-900 px-6 py-4 rounded shadow-md text-center w-[90%] max-w-xl">
            <span className="block font-medium whitespace-pre-line">
              {popupMessage}
            </span>
          </div>
        </div>
      )}

      <div className="w-full h-full pt-[65px]">
        <div className="relative h-full max-w-8xl mx-auto py-10 px-6 md:px-10 flex flex-col md:flex-row items-center md:items-start gap-12 backdrop-blur-md">
          {/* Left: Swiper */}
          <div className="w-full md:w-1/2 block sticky top-[65px] z-10">
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              loop
              className="rounded-2xl shadow-xl"
            >
              {gallery.map((img, idx) => (
                <SwiperSlide key={idx}>
                  <img
                    src={img.src}
                    alt={`Product ${idx}`}
                    className="rounded-xl object-cover w-full h-[300px] sm:h-[400px] md:h-[500px]"
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Color Selection */}
            <div className="flex gap-3 mt-4 flex-wrap">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedColor(img.color)}
                  className={`flex items-center gap-2 px-3 py-1 border rounded-lg transition ${
                    selectedColor === img.color
                      ? "bg-black text-white border-black"
                      : "bg-white text-black border-gray-300 hover:border-black"
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: img.color }}
                  />
                  <span className="capitalize">{img.color}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="w-full md:w-1/2 space-y-6">
            <h1 className="text-4xl font-bold">{product.name}</h1>

            {product.availableSizes?.sizes &&
              product.availableSizes?.sizes.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Select Size</h3>
                  <div className="flex gap-3 flex-wrap">
                    {product.availableSizes?.sizes.map((sz, idx) => (
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

            <div className="flex gap-4 pt-2">
              <button
                className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
                onClick={handleShopNow}
              >
                Shop Now
              </button>
              <button
                onClick={handleAddToWishList}
                className=" group border-black text-black px-6 py-2 rounded-lg hover:text-red-500 transition"
              >
                <i className="ri-heart-line text-2xl group-hover:hidden"></i>
                <i className="ri-heart-fill text-2xl hidden group-hover:inline"></i>
              </button>
              <button
                onClick={handleAddToCart}
                className="border-black text-black px-6 py-2 rounded-lg hover:bg-black hover:text-white transition"
              >
                <i className="ri-shopping-cart-line text-2xl"></i>
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Product Details</h3>
                {product.productDetails.length == 1 ? (
                  <p className="mt-2 text-sm text-gray-700">
                    {product.productDetails[0]}
                  </p>
                ) : (
                  <ul className="mt-2 text-sm text-gray-700 list-disc list-inside">
                    {product.productDetails.map((detail, index) => (
                      <li key={index}>{detail}</li>
                    ))}
                  </ul>
                )}
              </div>
              <ProductSpecifications specifications={product.specifications} />
              {product.howMade && (
                <div>
                  <h3 className="text-lg font-semibold">
                    How This Product Was Made
                  </h3>
                  <p className="mt-2 text-sm text-gray-700 whitespace-pre-line">
                    {product.howMade}
                  </p>
                </div>
              )}
              {product.care && (
                <div>
                  <h3 className="text-lg font-semibold">Care</h3>
                  {product.care.split("\n").map((line, index) => {
                    const trimmed = line.trim();
                    if (
                      trimmed.startsWith("•") ||
                      trimmed.startsWith("-") ||
                      trimmed.startsWith("*")
                    ) {
                      return (
                        <ul key={index} className="list-disc pl-5">
                          <li>{trimmed.slice(1).trim()}</li>
                        </ul>
                      );
                    } else if (trimmed === "") {
                      return <br key={index} />;
                    } else {
                      return <p key={index}>{trimmed}</p>;
                    }
                  })}
                </div>
              )}
              {product.delivery && (
                <div>
                  <h3 className="text-lg font-semibold">Delivery & Returns</h3>
                  <p className="mt-2 text-sm text-gray-700 whitespace-pre-line">
                    Delivery by {formattedDate}
                  </p>

                  <p className="mt-2 text-sm text-gray-700 whitespace-pre-line">
                    Return upto {product.returns}
                  </p>
                </div>
              )}
            </div>
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
