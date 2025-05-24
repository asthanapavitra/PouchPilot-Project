import React, { useContext } from "react";
import { UserDataContext } from "../context/UserContext";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { MobileResponsivenessContext } from "../context/MobileResponsiveness";
const MyCart = () => {
  const { user, setUser } = useContext(UserDataContext);
  const {isMobile}=useContext(MobileResponsivenessContext);
  const navigate = useNavigate();
  const location = useLocation();
  const cartPage = location.state?.cartPage;
  const handleRemove = async (productId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/users/remove-from-cart/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        const updatedUser = { ...user };
        updatedUser.cart = updatedUser.cart.filter(
          (item) => item._id !== productId
        );
        setUser(updatedUser);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to remove item from cart.");
    }
  };

  const handleBuyNow = (product) => {
    navigate(`/purchase`,{
      state: { product}
    })
  };
  return (
    <div className={`${cartPage ? "": "w-full max-w-4xl bg-white shadow-lg  rounded-2xl px-8 mt-10 py-4 md:-mt-1" }`}>
      {cartPage &&<Navbar />}
      <div
        className={`pt-[60px] min-h-screen rounded-2xl mt-10  flex items-center flex-col  ${
          cartPage
            ? "w-full px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 pt-[70px]"
            : "w-full max-w-4xl px-8 md:-mt-5 "
        }`}
      >
        <h2 className="text-3xl font-bold mb-6 self-start">My Cart</h2>

        <div className="space-y-5">
          {user.cart.length==0?(<p className="text-md text-gray-400">No item is in the cart</p>):user.cart.map((product) => (
            <div
              key={product._id}
              className={`flex flex-col sm:flex-row items-start gap-6 border-b-2 border-gray-300 pb-6 ${
                cartPage ? "w-full" : ""
              }`}
            >
              {/* Product Image */}
              <div
                onClick={() => {
                  navigate(`/product-details/${product._id}`, {
                    state: { product },
                  });
                }}
                className={`rounded-lg overflow-hidden bg-gray-100 cursor-pointer ${
                  cartPage ? "w-full sm:w-50 h-50" : "w-40 h-40"
                }`}
              >
                <img
                  src={product.images?.[0]}
                  alt={product.name}
                  className={`object-cover ${
                    cartPage ? "w-full h-full sm:w-50 sm:h-50" : "w-full h-full"
                  }`}
                />
              </div>

              {/* Product Details */}
              <div className="flex-grow ">
                <h3
                  onClick={() => {
                    navigate(`/product-details/${product._id}`, {
                      state: { product },
                    });
                  }}
                  className="text-xl font-semibold text-gray-800"
                >
                  {product.name}
                </h3>

                <div className="mt-2 text-lg font-bold text-black flex flex-col justify-evenly">
                  <div className="w-full ">
                    <span className="ml-2 text-lg font-medium text-pink-600 mr-2">
                      -{product.discount}%
                    </span>
                    <span className="text-xl">₹{product.price}</span>
                  </div>
                  <div>
                    {product.discount > 0 && (
                      <>
                        <span className="text-md font-normal text-gray-500  ml-2">
                          M.R.P ₹
                          <span className="line-through">
                            {Math.round(
                              (product.price * 100) / (100 - product.discount)
                            )}
                          </span>
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Buttons  */}
                <div className=" flex gap-3 ">
                  <button
                    onClick={() => handleBuyNow(product)}
                    className="px-4 py-2 text-green-500 hover:text-green-600 rounded-md cursor-pointer"
                  >
                    Buy Now
                  </button>
                  <button
                    onClick={() => handleRemove(product._id)}
                    className="px-4 py-2 text-red-500 hover:text-red-600  rounded-md cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyCart;
