import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [product, setProduct] = useState(null);
  const { productId, selectedColor, selectedSize } = location.state || {};
  const { user, setUser } = useContext(UserDataContext);
  useEffect(() => {
    async function fetchProduct() {
      try {
        let response = await axios.get(
          `${
            import.meta.env.VITE_BASE_URL
          }/products/get-product-by-id/${productId}`,
          {}
        );
        if (response.status === 200) {
          console.log(response.data.product);
          setProduct(response.data.product);
        }
      } catch (err) {
        console.log(err);
      }
    }
    if (product == null) fetchProduct();
  }, []);

  const [userInfo, setUserInfo] = useState({
    addresses: user.address,
    contact: user.contact,
  });
  const [shippingAddress, setShippingAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [postalCode, setPostalCode] = useState("");
  const [paymentInfo, setPaymentInfo] = useState({
    method: "UPI",
    paid: false,
  });

  const handleOrderPlacement = async () => {
    try {
      setPaymentInfo({ ...paymentInfo, paid: true });
      const form = {
        quantity,
        shippingAddress,
        postalCode,
        phone,
        city,
        state,
        country,
        paymentInfo,
        selectedColor,
        selectedSize,
      };
      console.log(form);
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/order/${product._id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Order placed successfully!");
        console.log(response.data.user)
        setUser(response.data.user);
        navigate("/my-orders");
      }
    } catch (error) {
      console.error("Order failed:", error.response?.data || error.message);
      alert("Failed to place order. Please try again.");
    }
  };

  const increaseQuantity = () => setQuantity((q) => q + 1);
  const decreaseQuantity = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  return (
    <div className="min-h-screen px-6 py-10 bg-white text-black">
  
      <div className="flex flex-col md:flex-row gap-8">
        {/* Order Summary */}
        <div className="w-full md:w-1/2">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="flex items-center gap-4 border p-4 rounded shadow">
            <img
              src={
                product?.images.find((img) => img.color === selectedColor)
                  ?.gallery[0]?.src
              }
              alt="product"
              className="w-32 h-32 object-cover rounded"
            />
            <div>
              <h3 className="text-lg font-bold">{product?.name}</h3>
              <p>
                Color: <span className="capitalize">{selectedColor}</span>
              </p>
              <p>Size: {selectedSize}</p>
              <p>Price: ₹{product?.price}</p>

              {/* Quantity Control */}
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={decreaseQuantity}
                  className="px-3 py-1 border rounded"
                >
                  –
                </button>
                <span>{quantity}</span>
                <button
                  onClick={increaseQuantity}
                  className="px-3 py-1 border rounded"
                >
                  +
                </button>
              </div>

              <p className="mt-2">Total: ₹{product?.price * quantity}</p>
            </div>
          </div>
        </div>

        {/* Address, Phone, Payment */}
        <div className="w-full md:w-1/2 space-y-6">
          <h2 className="text-xl font-semibold">Shipping Details</h2>

          {/* Address Dropdown */}
          {userInfo.addresses.length > 0 && (
            <select
              onChange={(e) => setShippingAddress(e.target.value)}
              className="w-full p-3 border rounded"
              defaultValue=""
            >
              <option value="" disabled>
                Select a saved address
              </option>
              {userInfo.addresses.map((addr, idx) => (
                <option key={idx} value={addr}>
                  {addr}
                </option>
              ))}
            </select>
          )}
          <input
            type="text"
            placeholder="Or enter a new shipping address"
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            className="w-full p-3 border rounded"
          />
          <div className="w-full flex items-center gap-4">
            <input
              type="text"
              placeholder="Postal Code"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="w-full flex items-center gap-4">
            {/* Country */}
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="State"
              className="w-full border p-2 rounded"
              required
            />
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Country"
              className="w-full border p-2 rounded"
              required
            />
          </div>
          {/* State */}

          {/* Phone Dropdown */}
          <label className="font-semibold block mb-1">Phone Number</label>

          <div className="flex flex-col gap-2">
            {userInfo.contact?.contactNumber ? (
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="phone"
                  value={`+${userInfo.contact.countryCode}${userInfo.contact.contactNumber}`}
                  checked={
                    phone ===
                    `+${userInfo.contact.countryCode}${userInfo.contact.contactNumber}`
                  }
                  onChange={(e) => setPhone(e.target.value)}
                />
                <span className="text-sm">
                  +{userInfo.contact.countryCode}{" "}
                  {userInfo.contact.contactNumber}
                </span>
              </div>
            ) : (
              <span className="text-sm text-red-500">
                No phone number found in profile
              </span>
            )}

            <div className="mt-2">
              <input
                type="text"
                placeholder="Or enter a new phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 border rounded"
              />
            </div>
          </div>

          {/* Payment Method */}
          <h2 className="text-xl font-semibold">Payment Method</h2>
          <select
            value={paymentInfo.method}
            onChange={(e) =>
              setPaymentInfo({ ...paymentInfo, method: e.target.value })
            }
            className="w-full p-3 border rounded"
          >
            <option value="UPI">UPI</option>
            <option value="Card">Credit/Debit Card</option>
            <option value="NetBanking">Net Banking</option>
            <option value="COD">Cash on Delivery</option>
          </select>

          {/* UPI Providers */}
          {paymentInfo.method === "UPI" && (
            <select
              value={paymentInfo.provider}
              onChange={(e) =>
                setPaymentInfo({ ...paymentInfo, provider: e.target.value })
              }
              className="w-full p-3 border rounded"
            >
              <option value="">Select UPI App</option>
              <option value="GPay">Google Pay</option>
              <option value="PhonePe">PhonePe</option>
              <option value="Paytm">Paytm</option>
              <option value="BHIM">BHIM</option>
            </select>
          )}

          <button
            onClick={handleOrderPlacement}
            className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
