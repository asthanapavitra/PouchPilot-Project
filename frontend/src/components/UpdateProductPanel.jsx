import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
const fields = [
  "material",
  "gender",
  "availableSizes",
  "style",
  "origin",
  "howMade",
  "delivery",
  "returns",
  "durability",

  "care",
  "tags",
];
const categoryFieldMap = {
  Sneakers: [
    "material",
    "gender",
    "warranty",
    "availableSizes",
    "style",
    "origin",
    "howMade",
    "delivery",
    "returns",

    "durability",

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
    "delivery",
    "returns",
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
    "delivery",
    "returns",

    "durability",

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
    "delivery",
    "returns",
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
    "delivery",
    "returns",

    "durability",

    "care",
    "category",
    "subcategory",
  ],
  Gifts: [
    "style",
    "origin",
    "howMade",
    "delivery",
    "returns",
    "forOccasion",
    "giftMessageAvailable",
  ],
  Merchandise: [
    "material",
    "style",
    "origin",
    "howMade",
    "delivery",
    "returns",

    "care",
    "category",
    "subcategory",
  ],
};

const UpdateProductPanel = ({ product, setProduct, setActiveView }) => {
  const handleDone = () => {
    setActiveView("subCategoryProducts");
  };
  const [formData, setFormData] = useState({
    name: product?.name || "",
    specifications: product?.specifications || "",
    care: product?.care || "",
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
    delivery: product?.delivery | "",
    returns: product?.returns || "",
    availableSizes: product?.availableSizes || {
      format: "standard",
      sizes: [],
    },
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
  const visibleFields =  fields;
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
    }, 25);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "tags") {
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
  const handleSpecificationChange = (index, field, value) => {
    const updatedSpecifications = [...formData.specifications];
    updatedSpecifications[index][field] = value;
    setFormData({ ...formData, specifications: updatedSpecifications });
  };
  const addSpecification = () => {
    setFormData({
      ...formData,
      specifications: [
        ...formData.specifications,
        { subHeading: "", value: "" },
      ],
    });
  };
  const removeSpecification = (index) => {
    const updatedSpecifications = [...formData.specifications];
    updatedSpecifications.splice(index, 1);
    setFormData({ ...formData, specifications: updatedSpecifications });
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
  const handleRemoveImage = (color, index) => {
    let removedId = null;

    setFormData((prev) => {
      const updatedImages = prev.images.map((img) => {
        if (img.color === color) {
          const updatedGallery = [...img.gallery];
          const removed = updatedGallery.splice(index, 1)[0];

          if (removed && removed.id) {
            removedId = removed.id;
          }
          return { ...img, gallery: updatedGallery };
        }
        return img;
      });
      return { ...prev, images: updatedImages };
    });

    // Now update removedImages outside
    if (removedId) {
      setRemovedImages((prevRemoved) => [...prevRemoved, removedId]);
    }
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
    let removedIds = [];

    setFormData((prev) => {
      const colorImages = prev.images.find((img) => img.color === color);
      if (colorImages) {
        removedIds = colorImages.gallery
          .filter((file) => file.id)
          .map((file) => file.id);
      }

      const updatedImages = prev.images.filter((img) => img.color !== color);
      return { ...prev, images: updatedImages };
    });

    // Update removedImages outside
    if (removedIds.length > 0) {
      setRemovedImages((prevRemoved) => [...prevRemoved, ...removedIds]);
    }
  };

  const handleImageUpload = (color, files) => {
    setFormData((prev) => {
      const updatedImages = prev.images.map((img) => {
        if (img.color === color) {
          return {
            ...img,
            gallery: [...img.gallery, ...files], // Add all selected files
          };
        }
        return img;
      });

      const colorExists = prev.images.some((img) => img.color === color);
      if (!colorExists) {
        updatedImages.push({ color, gallery: [...files] });
      }

      return { ...prev, images: updatedImages };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    showPopupMessage("Updating product");

    // Append all form fields except images
    for (let key in formData) {
      if (key === "images") continue;
      const value = formData[key];
      form.append(
        key,
        typeof value === "object" ? JSON.stringify(value) : value
      );
    }

    const imageMeta = [];
    let fileIndex = 0;

    formData.images.forEach((imgGroup) => {
      const color = imgGroup.color;
      imgGroup.gallery.forEach((file) => {
        if (file instanceof File) {
          form.append("newImages", file);
          imageMeta.push({ color, index: fileIndex++, isNew: true });
        } else {
          imageMeta.push({ color, index: fileIndex++, isNew: false });
        }
      });
    });

    form.append("imagesMeta", JSON.stringify(imageMeta));
    if (removedImages.length > 0) {
      form.append("removedImages", JSON.stringify(removedImages));
    }

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/products/update-product/${
          product._id
        }`,
        form,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.status === 201) {
        setProduct(res.data.product);
        showPopupMessage("Product updated successfully");
      }
    } catch (err) {
      console.error("Update error", err);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-semibold text-center mt-5">
        Update Product
      </h2>
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
            <div
              className="left-0 h-1 bg-blue-500 rounded-t"
              style={{ width: `${popupProgress}%` }}
            />
            <span className="block font-medium whitespace-pre-line">
              {popupMessage}
            </span>
          </div>
        </div>
      )}
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
                  multiple
                  onChange={(e) =>
                    handleImageUpload(
                      imgGroup.color,
                      Array.from(e.target.files)
                    )
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
                        : img.src
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
                "availableSizes",
              ].includes(key))
          )
            return null;
          if (key === "availableSizes") {
            return (
              <div className="border p-4 rounded w-full space-y-2">
                <label className="font-semibold block">Available Sizes</label>

                {/* Format selector */}
                <select
                  value={formData.availableSizes.format}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      availableSizes: {
                        format: e.target.value,
                        sizes: [], // reset sizes on format change
                      },
                    })
                  }
                  className="border px-2 py-1 rounded w-[60%]"
                >
                  <option value="standard">Standard (e.g. S, M, L)</option>
                  <option value="dimensions">
                    Dimensions(e.g. Length*Breadth*Height)
                  </option>
                </select>

                {/* Size input field */}
                {formData.availableSizes.format === "standard" && (
                  <input
                    type="text"
                    value={formData.availableSizes.sizes.join(", ")}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        availableSizes: {
                          ...formData.availableSizes,
                          sizes: e.target.value.split(",").map((s) => s.trim()),
                        },
                      })
                    }
                    placeholder="Enter sizes (comma separated, e.g. S, M, L)"
                    className="border p-2 rounded w-full"
                  />
                )}

                {formData.availableSizes.format === "dimensions" && (
                  <div className="space-y-2">
                    {formData.availableSizes.sizes.map((size, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={size}
                          onChange={(e) => {
                            const updated = [...formData.availableSizes.sizes];
                            updated[index] = e.target.value;
                            setFormData({
                              ...formData,
                              availableSizes: {
                                ...formData.availableSizes,
                                sizes: updated,
                              },
                            });
                          }}
                          placeholder="e.g. 10*5*3"
                          className="border p-2 rounded w-full"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...formData.availableSizes.sizes];
                            updated.splice(index, 1);
                            setFormData({
                              ...formData,
                              availableSizes: {
                                ...formData.availableSizes,
                                sizes: updated,
                              },
                            });
                          }}
                          className="text-red-600"
                        >
                          ❌
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          availableSizes: {
                            ...formData.availableSizes,
                            sizes: [...formData.availableSizes.sizes, ""],
                          },
                        })
                      }
                      className="text-blue-600 underline"
                    >
                      + Add Custom Size
                    </button>
                  </div>
                )}
              </div>
            );
          }
          if (key === "tags") {
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
          if (key === "specifications") {
            return (
              <div key={key}>
                <div className="flex flex-col md:flex-row md:justify-between  md:items-center w-full">
                  <label className="block capitalize font-medium mb-1">
                    Specifications
                  </label>
                  <ul className="space-y-2 w-[60%]">
                    {formData.specifications.map((specification, i) => (
                      <li key={i} className="flex gap-2 items-center  ">
                        <input
                          type="text"
                          value={specification.subHeading}
                          onChange={(e) =>
                            handleSpecificationChange(
                              i,
                              "subHeading",
                              e.target.value
                            )
                          }
                          className="border px-3 py-1 rounded w-full"
                        />
                        <input
                          type="text"
                          value={specification.value}
                          onChange={(e) =>
                            handleSpecificationChange(
                              i,
                              "value",
                              e.target.value
                            )
                          }
                          className="border px-3 py-1 rounded w-full"
                        />
                        <button
                          type="button"
                          onClick={() => removeSpecification(i)}
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
                  onClick={addSpecification}
                  className="mt-2 text-blue-600 underline"
                >
                  Add More
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
          if (key === "care") {
            return (
              <div
                key={key}
                className="flex items-center  justify-between gap-2"
              >
                <label className="capitalize font-medium">{key}</label>
                <textarea
                  value={formData.care}
                  onChange={(e) =>
                    setFormData({ ...formData, care: e.target.value })
                  }
                  placeholder={`Type care instructions:\nPress Enter for new line\nStart bullet points with • or -`}
                  rows={8}
                  className="w-[60%] border rounded-lg p-3 text-sm focus:outline-none focus:ring"
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
            type="button"
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
