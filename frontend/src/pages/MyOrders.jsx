import React, { useContext, useState } from "react";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
const MyOrders = ({ orderPage }) => {
  const { user, setUser } = useContext(UserDataContext);
  const[isCancelling,setIsCancelling]=useState(false);
  const navigate = useNavigate();
  const handleCancelOrder = async (orderId) => {
    try {
        alert("Cancelling you order");
      const res = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/users/cancel-order/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.status === 200) {
        setIsCancelling(false)
        alert("Order cancelled successfully");

        setUser((prev) => ({
          ...prev,
          orders: prev.orders.filter((order) => order._id !== orderId),
        }));
  
      }
    } catch (err) {
      alert("Error in cancelling order");
      console.log(err);
    }
  };
  return (
    <div
      className={`${
        orderPage ? "w-screen" : "w-full"
      } bg-white shadow-lg rounded-2xl mt-10 py-4 md:-mt-1`}
    >
         {isCancelling &&(<div className="fixed top-[65px] left-0 w-full bg-black text-white z-50 flex items-center justify-center h-12">
        <span className="text-lg font-medium">
        Cancelling yourorder <span className="dot-animation ml-1">.</span>
        </span>
      </div>)}
      {!orderPage && <Navbar />}
      <div
        className={`pt-[60px] min-h-screen rounded-2xl w-full flex items-center flex-col ${
          !orderPage
            ? "w-screen px-4 sm:px-8 md:px-16 "
            : "w-full max-w-4xl px-8 md:-mt-5"
        } ${window.innerWidth <= 768 ? "-mt-10" : ""}`}
      >
        <h2 className="text-2xl font-semibold mb-6 self-center ">Orders</h2>
        <div className="space-y-10 w-[90%] lg:w-[70%] md:w-[70%] flex flex-col items-center">
          {user.orders.length === 0 ? (
            <p className="text-md text-gray-400">No orders yet</p>
          ) : (
            user.orders.map((order, index) => {
              const product = order.product;
              const snapshot = order.productSnapshot;
              // Parse the delivery string (e.g., "7 days")
              const deliveryDays = parseInt(snapshot.delivery); // gets 7 from "7 days"
              console.log(deliveryDays);
              // Calculate estimated delivery date
              const estimatedDate = new Date();
              estimatedDate.setDate(estimatedDate.getDate() + deliveryDays);
              // Format the date (e.g., "Jun 7, 2025")
              const options = {
                year: "numeric",
                month: "short",
                day: "numeric",
              };
              const formattedDate = estimatedDate.toLocaleDateString(
                undefined,
                options
              );
              const total = snapshot.price * order.quantity;

              return (
                <div
                  key={index}
                  className="border rounded-xl p-4 shadow-md w-full"
                >
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <div className="w-full flex gap-10">
                      <p>
                        Order placed:{" "}
                        {new Date(order.orderDate).toLocaleDateString()}
                      </p>
                      <p>Total: ₹{total.toFixed(2)}</p>
                      {window.innerWidth > 1024 && (
                        <p>
                          Ship to:{" "}
                          <span className="underline cursor-pointer group relative">
                            {order.shippingInfo.address.split(" ")[0]}...
                            <span className="absolute hidden group-hover:block bg-gray-200 p-2 text-xs w-64 left-0 top-6 rounded shadow-md z-10">
                              {order.shippingInfo.address},{" "}
                              {order.shippingInfo.city},{" "}
                              {order.shippingInfo.state},{" "}
                              {order.shippingInfo.country} -{" "}
                              {order.shippingInfo.postalCode} <br />
                              Phone: {order.shippingInfo.phone}
                            </span>
                          </span>
                        </p>
                      )}
                    </div>
                    <div className="text-right ">
                      {window.innerWidth > 1024 && (
                        <p className="text-xs text-gray-500">
                          Order # {index + 100000}
                        </p>
                      )}
                      <button className="text-black hover:underline text-[10px] md:text-sm">
                        View order details
                      </button>
                    </div>
                  </div>

                  <div className="flex mt-4 gap-6 flex-col sm:flex-row items-start">
                    <div
                      onClick={() =>
                        navigate(`/product-details/${product._id}`, {
                          state: { productId: product._id },
                        })
                      }
                      className="w-32 h-32 bg-gray-100 rounded-md overflow-hidden cursor-pointer"
                    >
                      <img
                        src={snapshot.image}
                        alt={snapshot.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-grow">
                      <h3
                        onClick={() =>
                          navigate(`/product-details/${product}`, {
                            state: { productId: product },
                          })
                        }
                        className="text-lg font-semibold cursor-pointer"
                      >
                        {snapshot.name}
                      </h3>
                      <p className="text-sm text-gray-700 mt-1">
                        Qty: {order.quantity}
                      </p>
                      <p className="text-sm mt-1">
                        Estimated delivery:{" "}
                        <span className="font-medium text-green-700">
                          {formattedDate}
                        </span>
                      </p>
                      <p className="text-sm mt-1">
                        Status:{" "}
                        <span className="capitalize">{order.status}</span>
                      </p>

                      <div className="mt-4 flex gap-4 flex-wrap">
                        {(order.status === "processing" ||
                          order.status === "pending") && (
                          <button
                            onClick={() => {handleCancelOrder(order._id)
                                setIsCancelling(true);
                            }}
                            className="text-sm text-red-600 border border-red-600 px-3 py-1 rounded hover:bg-red-50"
                          >
                            Cancel Order
                          </button>
                        )}
                        <button
                          onClick={() =>
                            navigate("/order-place", {
                              state: {
                                productId: product,
                                selectedColor: snapshot.color,
                                selectedSize: snapshot.size,
                              },
                            })
                          }
                          className="text-sm text-blue-600 border border-blue-600 px-3 py-1 rounded hover:bg-blue-50"
                        >
                          Buy it again
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
