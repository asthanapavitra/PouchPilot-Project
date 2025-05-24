import React, { useState, useEffect } from "react";

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


const AddProductPanel = ({ selectedCategory, selectedSubCategory }) => {
  
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
    images: [{ color: "", gallery: [] }],
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

  const handleProductDetailsChange = (e) => {
    setFormData({
      ...formData,
      productDetails: e.target.value.split(",").map((d) => d.trim()),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting Product", formData);
    
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
        {formData.images.map((img, index) => (
          <div key={index} className="flex gap-2 items-center mb-2">
            {/* Color input */}
            <input
              type="text"
              placeholder="Color"
              value={img.color}
              onChange={(e) => {
                const newImages = [...formData.images];
                newImages[index].color = e.target.value;
                newImages[index].gallery = img.gallery;
                setFormData({ ...formData, images: newImages });
              }}
              className="border p-2 rounded w-[120px]"
            />

            {/* File input (multiple) */}
            <input
              type="file"
              onChange={(e) => handleImageUpload(img.color, e.target.files[0])}
              className="border p-2 rounded"
            />

            {/* Image count display */}
            <span className="text-sm text-gray-600">
              {img.gallery?.length || 0} image
              {img.gallery?.length === 1 ? "" : "s"}
            </span>
          </div>
        ))}

        {/* Add another color block */}
        <button
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 flex items-center gap-2 mt-2"
          type="button"
          onClick={() =>
            setFormData({
              ...formData,
              images: [...formData.images, { color: "", gallery: [] }],
            })
          }
        >
          <i className="ri-add-line text-lg"></i> Add Another Color
        </button>
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
