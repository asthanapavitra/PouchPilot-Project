import React, { useState } from "react";
import axios from "axios";

const AdminPanel = () => {
  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    price: "",
    discount: "",
    stock: "",
    category: "",
    subcategory: "",
    tags: "",
    color: "",
    style: "",
    origin: "",
    productDetails: "",
    howMade: "",
    deliveryAndReturns: "",
    availableColors: "",
    availableSizes: "",
    material: "",
    fragranceNotes: "",
    gender: "",
    warranty: "",
    isCustomizable: false,
    sustainability: "",
    durability: "",
    usage: "",
    storageInstructions: "",
    care: "",
    images: [
      
    ],
    imageGallery: [],
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file" && name=="images") {
      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...Array.from(files)],
      }));
    } 
    else if(type === "file" && name=="imageGallery") {
      setFormData((prev) => ({
        ...prev,
        imageGallery: [...(prev.imageGallery || []), ...Array.from(files)],
      }));
    }else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  const removeImage = (indexToRemove) => {
    setFormData((prevData) => ({
      ...prevData,
      images: prevData.images.filter((_, index) => index !== indexToRemove),
    }));
    console.log(formData.images)
  };
  const removeGalleryImage = (indexToRemove) => {
    setFormData((prevData) => ({
      ...prevData,
      imageGallery: prevData.imageGallery.filter(
        (_, index) => index !== indexToRemove
      ),
    }));
    console.log(formData.imageGallery)
  };
  console.log(formData.imageGallery)
  console.log(formData.images)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    for (let key in formData) {
      if (key === "images") {
        formData.images.forEach((file) => data.append("images", file));
      } 
      else if (key === "imageGallery") {
        formData.imageGallery.forEach((file) => data.append("imageGallery", file));
      } else if (
        [
          "tags",
          "productDetails",
          "availableColors",
          "availableSizes",
        ].includes(key)
      ) {
        const arrayValue = formData[key]
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
        arrayValue.forEach((val) => data.append(key, val));
      } else {
        data.append(key, formData[key]);
      }
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/products/create-product`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        alert("Product created successfully");
        console.log(response.data);
      }
    } catch (error) {
      alert("Error creating product");
      console.error(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow space-y-6">
      <h2 className="text-2xl font-bold text-center">Add New Product</h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {[
          { name: "name", label: "Product Name", type: "text", required: true },
          {
            name: "shortDescription",
            label: "Short Description",
            type: "textarea",
            required: true,
          },
          { name: "price", label: "Price", type: "number", required: true },
          { name: "discount", label: "Discount (%)", type: "number" },
          { name: "stock", label: "Stock", type: "number", required: true },
          { name: "tags", label: "Tags (comma separated)", type: "text" },
          { name: "style", label: "Style", type: "text" },
          { name: "origin", label: "Origin", type: "text" },
          {
            name: "productDetails",
            label: "Product Details (comma separated)",
            type: "textarea",
          },
          { name: "howMade", label: "How Made", type: "textarea" },
          {
            name: "deliveryAndReturns",
            label: "Delivery & Returns",
            type: "textarea",
          },
          {
            name: "availableColors",
            label: "Available Colors (comma separated)",
            type: "text",
          },
          {
            name: "availableSizes",
            label: "Available Sizes (comma separated)",
            type: "text",
          },
          { name: "material", label: "Material", type: "text" },
          { name: "fragranceNotes", label: "Fragrance Notes", type: "text" },
          { name: "gender", label: "Gender", type: "text" },
          { name: "warranty", label: "Warranty", type: "text" },
          { name: "sustainability", label: "Sustainability", type: "text" },
          { name: "durability", label: "Durability", type: "text" },
          { name: "usage", label: "Usage", type: "text" },
          {
            name: "storageInstructions",
            label: "Storage Instructions",
            type: "text",
          },
          { name: "care", label: "Care", type: "text" },
          { name: "subcategory", label: "Subcategory", type: "text" },
        ].map(({ name, label, type, required }) => (
          <div key={name} className="flex flex-col">
            <label htmlFor={name} className="font-medium">
              {label}
            </label>
            {type === "textarea" ? (
              <textarea
                name={name}
                id={name}
                required={required}
                className="p-2 border border-gray-300 rounded"
                onChange={handleChange}
              />
            ) : (
              <input
                type={type}
                name={name}
                id={name}
                required={required}
                className="p-2 border border-gray-300 rounded"
                onChange={handleChange}
              />
            )}
          </div>
        ))}

        {/* Category Dropdown */}
        <div className="flex flex-col">
          <label className="font-medium">Category</label>
          <select
            name="category"
            required
            className="p-2 border border-gray-300 rounded"
            onChange={handleChange}
          >
            <option value="">Select Category</option>
            <option value="Bags">Bags</option>
            <option value="Sneakers">Sneakers</option>
            <option value="Watches">Watches</option>
            <option value="Perfumes">Perfumes</option>
            <option value="Gifts">Gifts</option>
            <option value="Merchandise">Merchandise</option>
          </select>
        </div>

        {/* Is Customizable */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="isCustomizable"
            id="isCustomizable"
            onChange={handleChange}
          />
          <label htmlFor="isCustomizable" className="font-medium">
            Is Customizable
          </label>
        </div>

        {/* Images Upload */}
        <div className="flex flex-col col-span-full">
          <label className="font-medium">Upload Images</label>
          <input
            type="file"
            name="images"
            accept="image/*"
            multiple
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
          />
          {/* Show selected image names with cross icon */}
          {formData.images.length > 0 && (
            <ul className="mt-2 text-sm text-gray-700 space-y-1">
              {formData.images.map((file, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-gray-100 px-3 py-1 rounded"
                >
                  <span className="truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="text-red-500 font-bold hover:text-red-700 ml-3"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-col col-span-full">
          <label className="font-medium">Upload Images for Image Gallery</label>
          <input
            type="file"
            name="imageGallery"
            accept="image/*"
            multiple
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
          />
          {/* Show selected gallery image names with cross icon */}
          {formData.imageGallery.length > 0 && (
            <ul className="mt-2 text-sm text-gray-700 space-y-1">
              {formData.imageGallery.map((file, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-gray-100 px-3 py-1 rounded"
                >
                  <span className="truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(index)}
                    className="text-red-500 font-bold hover:text-red-700 ml-3"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Submit Button */}
        <div className="col-span-full text-center">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminPanel;
