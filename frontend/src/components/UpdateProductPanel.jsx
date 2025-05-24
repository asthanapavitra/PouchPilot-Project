import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

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
    "subcategory",
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
    "subcategory",
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
    "subcategory",
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
    "subcategory",
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
    "subcategory",
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
    "subcategory",
  ],
};

const UpdateProductPanel = ({product,setProduct,setActiveView}) => {
 

  

  const handleDone=()=>{
    setActiveView("subCategoryProducts")
  }
  const [formData, setFormData] = useState({
    name: product?.name || "",
    shortDescription: product?.shortDescription || "",
    price: product?.price || 0,
    discount: product?.discount || 0,
    stock: product?.stock || 0,
    category: product?.category || "",
    subcategory: product?.subcategory || "",
    tags: product?.tags || [],
    emi: product?.emi || { emiAvailable: false, noOfMonths: [] },
    style: product?.style || "",
    origin: product?.origin || "",
    productDetails: product?.productDetails || [],
    howMade: product?.howMade || "",
    deliveryAndReturns: product?.deliveryAndReturns || "",
    availableSizes: product?.availableSizes || [],
    material: product?.material || "",
    fragranceNotes: product?.fragranceNotes || "",
    gender: product?.gender || "",
    warranty: product?.warranty || "",
    isCustomizable: product?.isCustomizable || false,
    kids: product?.kids || { forKids: false, ageRange: "" },
    isActive: product?.isActive || true,
    images: product?.images || [{ color: "", gallery: [] }],
  });

  const [removedImages, setRemovedImages] = useState([]);
  const [newColor, setNewColor] = useState("");
  const visibleFields = categoryFieldMap[formData.category] || [];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "tags" || name === "availableSizes") {
      setFormData({
        ...formData,
        [name]: value.split(",").map((v) => v.trim()),
      });
    } else if (name === "kids.forKids") {
      setFormData({
        ...formData,
        kids: { ...formData.kids, forKids: checked },
      });
    } else if (name === "kids.ageRange") {
      setFormData({
        ...formData,
        kids: { ...formData.kids, ageRange: value },
      });
    } else if (name === "emi.emiAvailable") {
      setFormData({
        ...formData,
        emi: { ...formData.emi, emiAvailable: checked },
      });
    } else if (name === "emi.noOfMonths") {
      setFormData({
        ...formData,
        emi: {
          ...formData.emi,
          noOfMonths: value.split(",").map((v) => v.trim()),
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleProductDetailsChange = (index, value) => {
    const updatedDetails = [...formData.productDetails];
    updatedDetails[index] = value;
    setFormData({ ...formData, productDetails: updatedDetails });
  };

  const addProductDetail = () => {
    setFormData({
      ...formData,
      productDetails: [...formData.productDetails, ""],
    });
  };

  const removeProductDetail = (index) => {
    const updatedDetails = [...formData.productDetails];
    updatedDetails.splice(index, 1);
    setFormData({ ...formData, productDetails: updatedDetails });
  };

  const handleImageUpload = (color, file) => {
    setFormData((prev) => {
      const updatedImages = prev.images.map((img) => {
        if (img.color === color) {
          return {
            ...img,
            gallery: [...img.gallery, file],
          };
        }
        return img;
      });
      const colorExists = prev.images.some((img) => img.color === color);
      if (!colorExists) {
        updatedImages.push({ color, gallery: [file] });
      }
      return { ...prev, images: updatedImages };
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();

    for (let key in formData) {
      if (key === "images") continue;
      const value = formData[key];
      form.append(
        key,
        typeof value === "object" ? JSON.stringify(value) : value
      );
    }

    const imageMeta = [];
    let imageIndex = 0;
    formData.images.forEach((imgGroup) => {
      const color = imgGroup.color;
      imgGroup.gallery.forEach((file) => {
        if (file instanceof File) {
          form.append("images", file);
          imageMeta.push({ color, index: imageIndex++ });
        }
      });
    });

    form.append("imagesMeta", JSON.stringify(imageMeta));
    if (removedImages.length > 0) {
      form.append("removedImages", JSON.stringify(removedImages));
    }
    for (let pair of form.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/products/update-product/${
          product._id
        }`,
        form,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (res.status === 201) {
        setProduct(res.data.product);
        alert("Product updated successfully");
      }
    } catch (err) {
      console.error("Update error", err);
    }
  };

  return (
    <>
     
    <h2 className="text-2xl font-semibold text-center mt-5">Update Product</h2>
   
 
      <form
        onSubmit={handleSubmit}
        className=" space-y-4  max-w-4xl mx-auto mb-10"
      >
        <h3 className="text-lg font-bold">Images by Color</h3>
        <div className="flex  gap-4 items-center mb-4 w-full">
          <input
            type="text"
            placeholder="Add new color"
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            className="border px-3 py-1 rounded"
          />
          <button
            type="button"
            onClick={handleAddColor}
            className="bg-black text-white px-3 py-2 w-[60%] sm:w-[20%] rounded"
          >
            Add Color
          </button>
        </div>

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
                        : img
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

        {Object.keys(formData).map((key) => {
          if (
            key === "images" ||
            key === "rating" ||
            (visibleFields.length &&
              !visibleFields.includes(key) &&
              ![
                "name",
                "shortDescription",
                "price",
                "discount",
                "stock",
                "tags",
                "emi",
                "productDetails",
                "isCustomizable",
                "kids",
                "isActive",
              ].includes(key))
          )
            return null;

          if (key === "tags" || key === "availableSizes") {
            return (
              <div
                key={key}
                className="flex flex-col md:flex-row md:justify-between  md:items-center w-full"
              >
                <label className="block capitalize font-medium mb-1">
                  {key}
                </label>
                <input
                  type="text"
                  name={key}
                  value={formData[key].join(", ")}
                  onChange={handleChange}
                  className="md:w-[60%]w-full  border px-3 py-2 rounded"
                />
              </div>
            );
          }

          if (key === "emi") {
            return (
              <div
                key={key}
                className="flex flex-col md:flex-row md:justify-between  md:items-center w-full"
              >
                <label className="font-medium">EMI Available</label>
                <div className="flex items-center gap-4 w-full md:w-[60%]">
                  <input
                    type="checkbox"
                    name="emi.emiAvailable"
                    checked={formData.emi.emiAvailable}
                    onChange={handleChange}
                  />
                  Available
                  <label className="font-medium">Months</label>
                  <input
                    type="text"
                    name="emi.noOfMonths"
                    value={formData.emi.noOfMonths.join(", ")}
                    onChange={handleChange}
                    className="border px-3 py-1 rounded w-full md:w-[40%]"
                  />
                </div>
              </div>
            );
          }

          if (key === "productDetails") {
            return (
              <div key={key}>
                <div className="flex flex-col md:flex-row md:justify-between  md:items-center w-full">
                  <label className="block capitalize font-medium mb-1">
                    Product Details
                  </label>
                  <ul className="space-y-2 w-[60%]">
                    {formData.productDetails.map((detail, i) => (
                      <li key={i} className="flex gap-2 items-center  ">
                        <input
                          type="text"
                          value={detail}
                          onChange={(e) =>
                            handleProductDetailsChange(i, e.target.value)
                          }
                          className="border px-3 py-1 rounded w-full"
                        />
                        <button
                          type="button"
                          onClick={() => removeProductDetail(i)}
                          className="text-red-600"
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={addProductDetail}
                  className="mt-2 text-blue-600 underline"
                >
                  Add Detail
                </button>
              </div>
            );
          }

          if (key === "kids") {
            return (
              <div key={key}>
                <label className="block font-medium mb-1">For Kids:</label>
                <input
                  type="checkbox"
                  name="kids.forKids"
                  checked={formData.kids.forKids}
                  onChange={handleChange}
                />
                {formData.kids.forKids && (
                  <input
                    type="text"
                    name="kids.ageRange"
                    value={formData.kids.ageRange}
                    onChange={handleChange}
                    placeholder="Age Range"
                    className="ml-4 border px-3 py-1 rounded"
                  />
                )}
              </div>
            );
          }
          if (key === "gender") {
            return (
              <div
                key={key}
                className="flex justify-between items-center w-full"
              >
                <label className="block capitalize font-medium mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-[60%] border px-3 py-2 rounded"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Unisex">Unisex</option>
                </select>
              </div>
            );
          }

          if (typeof formData[key] === "boolean") {
            return (
              <div key={key} className="flex items-center gap-2">
                <label className="capitalize font-medium">{key}</label>
                <input
                  type="checkbox"
                  name={key}
                  checked={formData[key]}
                  onChange={handleChange}
                />
              </div>
            );
          }

          return (
            <div
              key={key}
              className="flex flex-col md:flex-row md:justify-between  md:items-center w-full"
            >
              <label className="block capitalize font-medium mb-1">{key}</label>
              <input
                type="text "
                name={key}
                value={formData[key]}
                onChange={handleChange}
                className=" w-full md:w-[60%] border px-3 py-2 rounded"
              />
            </div>
          );
        })}
        <div className="flex justify-center items-center gap-4 mt-6">
<button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
        >
          Save Changes
        </button>
        <button
          type="submit"
          onClick={handleDone}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
        >
          Done 
        </button>
        </div>
        
      </form>
    </>
  );
};

export default UpdateProductPanel;
