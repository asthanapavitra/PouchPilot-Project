import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const PaymentPage = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedSubOption, setSelectedSubOption] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupProgress, setPopupProgress] = useState(100);

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
    }, 25); // ~2.5 seconds
  };
  const handlePayment = () => {
    if (!selectedOption) {
      showPopupMessage("Please select a payment method");
      return;
    }

    if (selectedOption === "upi") {
      if (!selectedSubOption) {
        showPopupMessage("Please select a UPI app");
        return;
      }
      showPopupMessage(`Paying with ${selectedSubOption} (UPI) for ₹${total}`);
    } else if (selectedOption === "credit" || selectedOption === "debit") {
      showPopupMessage(
        `Paying with ${selectedOption.toUpperCase()} card for ₹${total}`
      );
    } else if (selectedOption === "netbanking") {
      if (!selectedSubOption) {
        showPopupMessage("Please select a bank");
        return;
      }
      showPopupMessage(
        `Paying via Net Banking with ${selectedSubOption} for ₹${total}`
      );
    }
  };

  const toggleOption = (option) => {
    setSelectedOption((prev) => (prev === option ? null : option));

    if (option === "upi" && orderSummary.emi) {
      showPopupMessage("EMI is not available for UPI payments");
    }
  };
  const location = useLocation();
  const orderSummary = location.state?.product || {};

  const total = orderSummary.price * quantity;

  const handleQuantityChange = (type) => {
    setQuantity((prev) =>
      type === "increment" ? prev + 1 : Math.max(1, prev - 1)
    );
  };

  const paymentIcons = {
    GPay: "/upiPhotos/gpay.png",
    PhonePe: "/upiPhotos/phonepay.jpg",
    Paytm: "/upiPhotos/paytm.jpg",
    "Amazon Pay": "/upiPhotos/amazonpay.png",
    "Bhim UPI": "/upiPhotos/bhimupi.png",
    Cred: "/upiPhotos/cred.jpg",
    "Credit Card": "/creditcard.png",
    "Debit Card": "/debitcard.png",
    "Net Banking": "/netbanking.png",
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />
      {showPopup && (
        <div className="w-full  flex justify-center mt-2 z-50">
          <div className="fixed top-[70px] z-999 bg-blue-100 text-blue-900 px-6 py-4 rounded shadow-md text-center w-[90%] max-w-xl">
            <div
              className=" left-0 h-1 bg-blue-500 rounded-t"
              style={{ width: `${popupProgress}%` }}
            />
            <span className="block font-medium">{popupMessage}</span>
          </div>
        </div>
      )}
      <div className="pt-[140px] px-4 md:px-16 lg:px-28">
        <div className="w-full  flex flex-col md:flex-row gap-8">
          {/* Payment Options */}
          <div className="md:w-1/2 space-y-4">
            <h2 className="text-2xl font-semibold pb-2">
              Select Payment Method
            </h2>

            {/* UPI */}
            <div className="border p-4 rounded shadow">
              <div
                className="font-medium cursor-pointer"
                onClick={() => toggleOption("upi")}
              >
                Pay using UPI
              </div>
              {selectedOption === "upi" && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {["PhonePe", "Amazon Pay", "Bhim UPI"].map((upiApp, i) => (
                    <label
                      key={i}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="upi"
                        value={upiApp}
                        onChange={() => setSelectedSubOption(upiApp)}
                      />
                      <img
                        src={paymentIcons[upiApp]}
                        alt={upiApp}
                        className="w-6 h-6"
                      />
                      {upiApp}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Credit Card */}
            <div className="border p-4 rounded shadow">
              <div
                className="font-medium cursor-pointer"
                onClick={() => toggleOption("credit")}
              >
                Credit Card
              </div>
              {selectedOption === "credit" && (
                <div className="mt-4 space-y-4">
                  <input
                    type="text"
                    placeholder="Card Number"
                    className="w-full border rounded p-2"
                  />
                  <input
                    type="text"
                    placeholder="Name on Card"
                    className="w-full border rounded p-2"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-1/2 border rounded p-2"
                    />
                    <input
                      type="password"
                      placeholder="CVV"
                      className="w-1/2 border rounded p-2"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Debit Card */}
            <div className="border p-4 rounded shadow">
              <div
                className="font-medium cursor-pointer"
                onClick={() => toggleOption("debit")}
              >
                Debit Card
              </div>
              {selectedOption === "debit" && (
                <div className="mt-4 space-y-4">
                  <input
                    type="text"
                    placeholder="Card Number"
                    className="w-full border rounded p-2"
                  />
                  <input
                    type="text"
                    placeholder="Name on Card"
                    className="w-full border rounded p-2"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-1/2 border rounded p-2"
                    />
                    <input
                      type="password"
                      placeholder="CVV"
                      className="w-1/2 border rounded p-2"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Net Banking */}
            <div className="border p-4 rounded shadow">
              <div
                className="font-medium cursor-pointer"
                onClick={() => toggleOption("netbanking")}
              >
                Net Banking
              </div>
              {selectedOption === "netbanking" && (
                <div className="mt-4 space-y-2">
                  {["HDFC", "ICICI", "SBI", "Axis", "Yes Bank"].map(
                    (bank, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="bank"
                          id={bank}
                          value={bank}
                          onChange={() => setSelectedSubOption(bank)}
                        />
                        <label htmlFor={bank}>{bank}</label>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="md:w-1/2  p-6 rounded shadow space-y-4">
            <h2 className="text-2xl font-semibold  pb-2">Order Summary</h2>
            <div className="flex items-center gap-4">
              <img
                src={orderSummary.images[0].gallery[0]}
                alt={orderSummary.name}
                className="w-24 h-24 object-cover rounded"
              />
              <div>
                <h3 className="text-lg font-medium">{orderSummary.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() => handleQuantityChange("decrement")}
                    className="w-6 h-6 border rounded"
                  >
                    -
                  </button>
                  <span className="px-2">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange("increment")}
                    className="w-6 h-6 border rounded"
                  >
                    +
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Shipping: ₹{orderSummary.price}
                </p>
                <p className="text-sm text-green-600">
                  {orderSummary.deliveryAndReturns}
                </p>
                <p className="text-sm text-blue-600">
                  {orderSummary.estimatedArrival}
                </p>
              </div>
            </div>
            <div className="pt-4 border-t mt-4 text-right">
              <p className="font-bold text-xl">Total: ₹{total}</p>
              <button
                className="mt-4 w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
                onClick={handlePayment}
              >
                Proceed to Pay
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* EMI Alert */}
    </div>
  );
};

export default PaymentPage;
