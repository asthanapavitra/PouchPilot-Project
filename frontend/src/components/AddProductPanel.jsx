import React, { useState, useEffect } from "react";
import axios from 'axios'
const categoryFieldMap = {
  Sneakers: [
    "material",
    "gender",
    "warranty",
    "availableSizes",
    "style",
    "origin",
    "howMade",
    "deliveryAndReturns",
    "sustainability",
    "durability",
    "usage",
    "storageInstructions",
    "care",
    "category",
    "subcategory"
  ],
  Perfumes: [
    "fragranceNotes",
    "gender",
    "warranty",
    "style",
    "origin",
    "howMade",
    "deliveryAndReturns",
    "category",
    "subcategory"
  ],
  Bags: [
    "material",
    "gender",
    "availableSizes",
    "style",
    "origin",
    "howMade",
    "deliveryAndReturns",
    "sustainability",
    "durability",
    "usage",
    "storageInstructions",
    "care",
    "category",
    "subcategory"
  ],
  Watches: [
    "material",
    "warranty",
    "gender",
    "style",
    "origin",
    "howMade",
    "deliveryAndReturns",
    "category",
    "subcategory"
  ],
  Caps: [
    "material",
    "gender",
    "availableSizes",
    "style",
    "origin",
    "howMade",
    "deliveryAndReturns",
    "sustainability",
    "durability",
    "usage",
    "care",
    "category",
    "subcategory"
  ],
  Gifts: [
    "style",
    "origin",
    "howMade",
    "deliveryAndReturns",
    "forOccasion",
    "giftMessageAvailable",
  ],
  Merchandise: [
    "material",
    "style",
    "origin",
    "howMade",
    "deliveryAndReturns",
    "sustainability",
    "usage",
    "care",
    "category",
    "subcategory"
  ],
};


const AddProductPanel = ({ selectedCategory, selectedSubCategory,setActiveView }) => {
  const [removedImages, setRemovedImages] = useState([]);
    const [newColor, setNewColor] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    price: "Price",
    discount: "Discount",
    stock: "Stock",
    category: selectedCategory || "",
    subcategory: selectedSubCategory || "",
    tags: [],
    emi: {
      emiAvailable: false,
      noOfMonths: [],
    },
    style: "",
    origin: "",
    productDetails: [""],
    howMade: "",
    deliveryAndReturns: "",
   
    availableSizes: [],
    material: "",
    fragranceNotes: "",
    gender: "",
    warranty: "",
    isCustomizable: false,
    kids: {
      forKids: false,
      ageRange: "",
    },
    rating: 0,
    sustainability: "",
    durability: "",
    usage: "",
    storageInstructions: "",
    care: "",
    isActive: true,
    images: [],
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      category: selectedCategory,
      subcategory: selectedSubCategory,
    }));
  }, [selectedCategory, selectedSubCategory]);

  const visibleFields = categoryFieldMap[selectedCategory] || [];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleRemoveImage = (color, index) => {
    setFormData((prev) => {
      const updatedImages = prev.images.map((img) => {
        if (img.color === color) {
          const updatedGallery = [...img.gallery];
          const removed = updatedGallery.splice(index, 1)[0];
          if (removed && removed._id) {
            setRemovedImages((prevRemoved) => [...prevRemoved, removed._id]);
          }
          return { ...img, gallery: updatedGallery };
        }
        return img;
      });
      return { ...prev, images: updatedImages };
    });
  };

  const handleAddColor = () => {
    if (!newColor.trim()) return;
    setFormData((prev) => {
      const exists = prev.images.some((img) => img.color === newColor.trim());
      if (exists) return prev;
      return {
        ...prev,
        images: [...prev.images, { color: newColor.trim(), gallery: [] }],
      };
    });
    setNewColor("");
  };
  const handleRemoveColorGroup = (color) => {
    setFormData((prev) => {
      // Filter out the color group with the given color
      const updatedImages = prev.images.filter((img) => img.color !== color);
      return { ...prev, images: updatedImages };
    });
  };
const handleProductDetailsChange = (e) => {
    const details = e.target.value.split(",").map((detail) => detail.trim());
    setFormData((prev) => ({
      ...prev,
      productDetails: details,
    }));
  };

  const handleImageUpload = (color, file) => {
    console.log("Inside Image Upload");

    setFormData((prev) => {
      const updatedImages = prev.images.map((img) => {
        if (img.color === color) {
          return {
            ...img,
            gallery: [...img.gallery, file], // Create new gallery array
          };
        }
        return img;
      });

      const colorExists = prev.images.some((img) => img.color === color);
      if (!colorExists) {
        updatedImages.push({ color, gallery: [file] });
      }

      console.log(updatedImages);
      return { ...prev, images: updatedImages };
    });
  };

 

  const handleSubmit = async (e) => {
  e.preventDefault();

  const form = new FormData();

  // Append non-image fields
  for (let key in formData) {
    if (key === "images") continue; // skip for now
    const value = formData[key];
    form.append(key, typeof value === "object" ? JSON.stringify(value) : value);
  }

  // Prepare images and imageMeta
  const imageMeta = [];
  let imageIndex = 0;

  formData.images.forEach((imgGroup) => {
    const color = imgGroup.color;
    imgGroup.gallery.forEach((file) => {
      form.append("images", file);
      imageMeta.push({
        color,
        index: imageIndex++, // Keep track of order for backend
      });
    });
  });
  

  // Append imageMeta as JSON
  form.append("imagesMeta", JSON.stringify(imageMeta));
  for (let pair of form.entries()) {
  console.log(pair[0], pair[1]);
}

  try {
    
    const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/products/create-product`, form, {
      headers: { 
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        "Content-Type": "multipart/form-data" },
    });
    if(res.status==201)
      console.log("Product submitted", res.data);

     alert("Product added successfully")
     setActiveView("subCategoryProducts")
  } catch (err) {
   
    console.error("Submission error", err);
  }
};

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Add New Product</h2>

      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="shortDescription"
          value={formData.shortDescription}
          onChange={handleChange}
          placeholder="Short Description"
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          placeholder="Stock"
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          name="discount"
          value={formData.discount}
          onChange={handleChange}
          placeholder="Discount (%)"
          className="border p-2 rounded"
        />
      </div>

      <textarea
        placeholder="Product Details (comma separated)"
        onChange={handleProductDetailsChange}
        className="border p-2 rounded w-full"
      ></textarea>

      {visibleFields.includes("material") && (
        <input
          type="text"
          name="material"
          value={formData.material}
          onChange={handleChange}
          placeholder="Material"
          className="border p-2 rounded w-full"
        />
      )}

      {visibleFields.includes("fragranceNotes") && (
        <input
          type="text"
          name="fragranceNotes"
          value={formData.fragranceNotes}
          onChange={handleChange}
          placeholder="Fragrance Notes"
          className="border p-2 rounded w-full"
        />
      )}

      {visibleFields.includes("availableSizes") && (
        <input
          type="text"
          name="availableSizes"
          onChange={(e) =>
            setFormData({
              ...formData,
              availableSizes: e.target.value.split(",").map((s) => s.trim()),
            })
          }
          placeholder="Available Sizes (comma separated)"
          className="border p-2 rounded w-full"
        />
      )}

      {[
        "category",
        "subcategory",
        "style",
        "origin",
        "howMade",
        "deliveryAndReturns",
        "sustainability",
        "durability",
        "usage",
        "storageInstructions",
        "care",
        "warranty",
        "tags"
      ].map((field) =>
        visibleFields.includes(field) ? (
          <input
            key={field}
            type="text"
            name={field}
            value={formData[field]}
            onChange={handleChange}
            placeholder={field.replace(/([A-Z])/g, " $1")}
            className="border p-2 rounded w-full"
          />
        ) : null
      )}

      <div className="flex flex-wrap gap-4 items-center">
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="border px-3 py-2  rounded min-w-[150px]"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="unisex">Unisex</option>
        </select>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.kids.forKids}
            onChange={(e) =>
              setFormData({
                ...formData,
                kids: { ...formData.kids, forKids: e.target.checked },
              })
            }
          />
          For Kids
        </label>

        {formData.kids.forKids && (
          <input
            type="text"
            placeholder="Age Range (e.g., 4–7 yrs)"
            value={formData.kids.ageRange}
            onChange={(e) =>
              setFormData({
                ...formData,
                kids: { ...formData.kids, ageRange: e.target.value },
              })
            }
            className="border p-2 rounded min-w-[150px]"
          />
        )}
      </div>

      {/* EMI */}
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={formData.emi.emiAvailable}
          onChange={(e) =>
            setFormData({
              ...formData,
              emi: { ...formData.emi, emiAvailable: e.target.checked },
            })
          }
          className="mr-2"
        />
        <label>EMI Available</label>
      </div>
      {formData.emi.emiAvailable && (
        <input
          type="text"
          placeholder="EMI Months (e.g. 3,6,9)"
          className="border p-2 rounded w-full"
          onChange={(e) =>
            setFormData({
              ...formData,
              emi: {
                ...formData.emi,
                noOfMonths: e.target.value.split(",").map(Number),
              },
            })
          }
        />
      )}

      {/* Customizable */}
      <div className="flex items-center">
        <input
          type="checkbox"
          name="isCustomizable"
          checked={formData.isCustomizable}
          onChange={handleChange}
          className="mr-2"
        />
        <label>Customizable</label>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Images by Color</h3>
        {formData.images.map((imgGroup, idx) => (
          <div key={idx} className="border p-4  rounded mb-4 relative ">
            <div className="flex items-center gap-4 mb-2 ">
              <span className="font-semibold">Color: {imgGroup.color}</span>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleImageUpload(imgGroup.color, e.target.files[0])
                  }
                />
                <button
                  type="button"
                  onClick={() => handleRemoveColorGroup(imgGroup.color)}
                  className="absolute right-2  text-red-600 font-bold px-2 py-1 hover:bg-red-100 rounded"
                  aria-label={`Remove color ${imgGroup.color}`}
                >
                  ✕
                </button>
              </div>
            </div>

            <div className={`flex flex-wrap gap-2`}>
              {imgGroup.gallery.map((img, i) => (
                <div key={i} className="relative border p-2 rounded">
                  <img
                    src={
                      img.data
                        ? `data:${img.contentType};base64,${img.data}`
                        : URL.createObjectURL(img)
                    }
                    alt={`preview-${i}`}
                    className="w-24 h-24 object-cover rounded"
                  />

                  <button
                    type="button"
                    onClick={() => handleRemoveImage(imgGroup.color, i)}
                    className="absolute top-0 right-0 bg-red-500 text-white px-2 rounded-bl"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        <div className="flex  gap-4 items-center mb-4">
          <input
            type="text"
            placeholder="Add new color"
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            className="border px-3 py-1 rounded"
          />
          <button
            type="button"
            value={newColor}
            onClick={handleAddColor
          }
            className="bg-black text-white px-3 py-1 rounded"
          >
            Add Color
          </button>
        </div>
        {/* Add another color block */}
        
      </div>

      <button
        type="submit"
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 w-full mt-4"
      >
        Add Product
      </button>
    </form>
  );
};

export default AddProductPanel;
