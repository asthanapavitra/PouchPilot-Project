import React, { useContext, useState } from "react";
import Navbar from "../components/Navbar";
import { UserDataContext } from "../context/UserContext";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import { useNavigate } from "react-router-dom";
import MyCart from "./MyCart";
const UserProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { user, setUser } = useContext(UserDataContext);
  const navigate = useNavigate();
  const [editableUser, setEditableUser] = useState({
    fullName: { ...user.fullName },
    address: [...user.address],
    contact: { ...user.contact },
    picture: user.picture ? user.picture : null,
    pictureFile: null, // For storing the uploaded file
  });
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    const formData = {
      fullName: {
        firstName: editableUser.fullName.firstName,
        lastName: editableUser.fullName.lastName,
      },
      address: [],
      contact: {},
    };

    // Addresses (assuming array)
    editableUser.address?.forEach((addr, index) => formData.address.push(addr));

    // Contact Info
    if (editableUser.contact?.countryCode)
      formData.contact.countryCode = editableUser.contact.countryCode;
    if (editableUser.contact?.contactNumber)
      formData.contact.contactNumber = editableUser.contact.contactNumber;

    // Profile Picture (only if updated)
    if (editableUser.pictureFile) {
      formData.picture = editableUser.pictureFile;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/update-profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status == 200) {
        alert("Successfully updated");
        setUser(response.data.user);
        setActiveTab("profile");
      }
    } catch (err) {
      console.log(err);
      alert("Error while updating details");
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/users/logout`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status == 200) {
        alert("Successfully logging you out");
        navigate("/");
      }
    } catch (err) {
      console.log(err);
      alert("Error while logging you out");
    }
  };
  return (
    <div className="w-screen min-h-screen ">
      <Navbar
        username={
          user.fullName.firstName != "Unknown"
            ? user.fullName.firstName
            : user.userName
        }
      />
      <div className="min-h-screen flex bg-white text-black w-screen justify-between pt-[80px]  gap-10">
        {/* Sidebar */}
        <div className="w-[30%] md:w-[15%] bg-white text-black p-6 flex h-screen flex-col items-center shadow-xl">
          <img
          onClick={() => {
            setActiveTab("profile");
          }}
            src={user.picture ? user.picture : "/default-profile-pic.png"}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover mb-4"
          />
          <h2
            onClick={() => {
              setActiveTab("profile");
            }}
            className="text-xl font-semibold mb-6 cursor-pointer"
          >
            {user.fullName.firstName}
          </h2>
          <nav className="flex flex-col gap-3 items-center w-full">
            <button
              onClick={() => setActiveTab("orders")}
              className="text-left hover:text-gray-700 cursor-pointer"
            >
              My Orders
            </button>
            <button
              onClick={() => setActiveTab("cart")}
              className="text-left hover:text-gray-700 cursor-pointer"
            >
              My Cart
            </button>
            <button
              onClick={handleLogout}
              className="text-left text-red-600 hover:text-red-800 cursor-pointer"
            >
              Logout
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex w-[85%] bg-white px-8">
          {activeTab === "profile" && (
            <div className="w-full max-w-4xl bg-white shadow-lg  rounded-2xl px-8 mt-10 py-4 md:-mt-1">
              {/* Profile Header */}
              <div className="flex flex-col md:flex-row items-center gap-6 border-b pb-6">
                <img
                  src={user.picture ? user.picture : "/default-profile-pic.png"}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover shadow-md"
                />
                <div className="text-center md:text-left">
                  <h2 className="text-2xl font-bold">
                    {user.fullName.firstName != "Unknown"
                      ? user.fullName.firstName
                      : user.userName}
                  </h2>
                  <p className="text-gray-500">{user.email}</p>
                  <p className="text-gray-500">{user.phone}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Member since {user.memberSince}
                  </p>
                </div>
              </div>

              {/* User Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Shipping Address
                  </h3>
                  {user.address.map((addr, index) => (
                    <div key={index} className="w-full">
                      <p className="text-gray-600">{addr}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Account Settings
                  </h3>
                  <button
                    onClick={() => setActiveTab("update-profile")}
                    className="bg-black text-white px-4 py-2 rounded-lg hover:bg-black/90"
                  >
                    Update Profile
                  </button>
                </div>
              </div>

              {/* Order History (Optional) */}
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Recent Orders</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg shadow-sm flex justify-between items-center">
                    <div>
                      <p className="font-semibold">#12345 - Black Hoodie</p>
                      <p className="text-sm text-gray-500">
                        Ordered on March 3, 2025
                      </p>
                    </div>
                    <button className="text-sm text-blue-500 hover:underline">
                      View Details
                    </button>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg shadow-sm flex justify-between items-center">
                    <div>
                      <p className="font-semibold">#12346 - White Sneakers</p>
                      <p className="text-sm text-gray-500">
                        Ordered on March 10, 2025
                      </p>
                    </div>
                    <button className="text-sm text-blue-500 hover:underline">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl px-8 mt-10 py-6  md:-mt-1">
              <h2 className="text-3xl font-bold mb-4">My Orders</h2>
              <ul className="list-disc ml-5">
                {user.orders.map((order) => (
                  <li key={order.id}>
                    {order.item} – {order.date} ({order.id})
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === "cart" && (
            <MyCart/>
          )}

          {activeTab === "update-profile" && (
            <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl px-8 mt-10 py-6 md:-mt-1">
              <h2 className="text-2xl font-bold mb-6">Update Profile</h2>

              <form
                onSubmit={handleUpdateProfile}
                className="space-y-6"
                encType="multipart/form-data"
              >
                {/* Profile Picture Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Picture
                  </label>
                  {editableUser.picture && (
                    <img
                      src={
                        editableUser.pictureFile
                          ? URL.createObjectURL(editableUser.pictureFile)
                          : editableUser.picture
                          ? editableUser.picture
                          : "/default-profile-pic.png"
                      }
                      alt="Preview"
                      className="w-24 h-24 rounded-full object-cover mb-2"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setEditableUser({
                          ...editableUser,
                          pictureFile: file,
                          picture: URL.createObjectURL(file),
                        });
                      }
                    }}
                  />
                </div>

                {/* First & Last Name in One Row */}
                <div className="flex flex-col md:flex-row md:space-x-4">
                  {/* First Name */}
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={editableUser.fullName.firstName}
                      onChange={(e) =>
                        setEditableUser({
                          ...editableUser,
                          fullName: {
                            ...editableUser.fullName,
                            firstName: e.target.value,
                          },
                        })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>

                  {/* Last Name */}
                  <div className="w-full mt-4 md:mt-0">
                    <label className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={editableUser.fullName.lastName}
                      onChange={(e) =>
                        setEditableUser({
                          ...editableUser,
                          fullName: {
                            ...editableUser.fullName,
                            lastName: e.target.value,
                          },
                        })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>
                </div>
                {/* Addresses */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shipping Addresses
                  </label>
                  {editableUser.address.map((addr, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={addr}
                        onChange={(e) => {
                          const updated = [...editableUser.address];
                          updated[index] = e.target.value;
                          setEditableUser({
                            ...editableUser,
                            address: updated,
                          });
                        }}
                        className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = editableUser.address.filter(
                            (_, i) => i !== index
                          );
                          setEditableUser({
                            ...editableUser,
                            address: updated,
                          });
                        }}
                        className="text-sm text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setEditableUser({
                        ...editableUser,
                        address: [...editableUser.address, ""],
                      })
                    }
                    className="text-sm text-blue-500 hover:underline"
                  >
                    + Add Another Address
                  </button>
                </div>

                {/* Phone Number with Flag and Auto Country Code */}
                {/* Country Code and Contact Number in One Row */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>

                  <div className="flex flex-wrap gap-3 items-center">
                    {/* Country Code with Flag */}
                    <div className="flex-shrink-0">
                      <PhoneInput
                        country={"auto"}
                        value={
                          editableUser.contact?.countryCode
                            ? editableUser.contact.countryCode
                                .toString()
                                .replace("+", "")
                            : ""
                        }
                        onChange={(value, countryData) => {
                          setEditableUser({
                            ...editableUser,
                            contact: {
                              ...(editableUser.contact || {}),
                              countryCode: `+${countryData.dialCode}`,
                            },
                          });
                        }}
                        enableSearch
                        inputStyle={{
                          width: "100px",
                          paddingLeft: "48px",
                          borderRadius: "0.375rem",
                          paddingTop: "0.5rem",
                          paddingBottom: "0.5rem",
                          border: "1px solid #d1d5db",
                        }}
                        containerStyle={{
                          width: "100px",
                        }}
                        buttonStyle={{
                          border: "none",
                          backgroundColor: "transparent",
                          paddingLeft: "8px",
                        }}
                        geoIpLookup={(callback) => {
                          fetch("https://ipapi.co/json")
                            .then((res) => res.json())
                            .then((data) =>
                              callback(data.country_code.toLowerCase())
                            )
                            .catch(() => callback("us"));
                        }}
                      />
                    </div>

                    {/* Contact Number */}
                    <div className="flex-grow">
                      <input
                        type="tel"
                        placeholder="Enter contact number"
                        value={editableUser.contact?.contactNumber || ""}
                        onChange={(e) =>
                          setEditableUser({
                            ...editableUser,
                            contact: {
                              ...(editableUser.contact || {}),
                              contactNumber: e.target.value,
                            },
                          })
                        }
                        className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    className="bg-black text-white px-6 py-2 rounded-md transition"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
