import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";

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

const AddProductPanel = ({
  selectedCategory,
  selectedSubCategory,
  setActiveView,
  categories,
}) => {
  const [newColor, setNewColor] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    specifications: [],
    price: "Price",
    discount: "Discount",
    stock: "Stock",
    categoryLevel1: selectedCategory || "",
    subcategory: "",
    productType: "",
    tags: "",
    emi: {
      emiAvailable: false,
      noOfMonths: [],
    },
    style: "",
    origin: "",
    productDetails: [""],
    howMade: "",
    delivery: "",
    returns: "",
    availableSizes: {
      format: "standard",
      sizes: [],
    },
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

  const [specifications, setSpecifications] = useState([
    { subHeading: "", value: "" },
  ]);
  const [productDescription, setProductDescription] = useState([""]);
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [categoryLevel1, setCategoryLevel1] = useState(selectedCategory || "");
  const [categoryLevel2, setCategoryLevel2] = useState("");
  const [categoryLevel3, setCategoryLevel3] = useState("");
  // Get subcategories based on selected top-level category
  const subCategoriesLevel2 = useMemo(() => {
    return (
      categories.find((cat) => cat.name === categoryLevel1)?.subcategories || []
    );
  }, [categoryLevel1, categories]);
  const subCategoriesLevel3 = useMemo(() => {
    const selectedSub = subCategoriesLevel2.find(
      (sub) => sub.name === categoryLevel2
    );
    if (!selectedSub || !Array.isArray(selectedSub.productsType)) return [];

    return selectedSub.productsType
      .map((item) => {
        if (typeof item === "string") return { name: item }; // simple type
        if (typeof item === "object" && item.name && item.subTypes) return item;
        return null;
      })
      .filter(Boolean);
  }, [categoryLevel1, categoryLevel2, subCategoriesLevel2]);

  const showPopupMessage = (message) => {
    setPopupMessage(message);
    setShowPopup(true);

    // Hide popup after 10 seconds
    setTimeout(() => {
      setShowPopup(false);
    }, 10000); // 10 seconds = 10,000 milliseconds
  };

  const handleSpecChange = (index, field, value) => {
    const updated = [...specifications];
    updated[index][field] = value;
    formData.specifications = updated;
    setSpecifications(updated);
  };

  const addSpecRow = () => {
    formData.specifications = [
      ...specifications,
      { subHeading: "", value: "" },
    ];
    setSpecifications([...specifications, { subHeading: "", value: "" }]);
  };

  const handleDescriptionChange = (index, value) => {
    const updated = [...productDescription];
    updated[index] = value;
    formData.productDetails = updated;
    setProductDescription(updated);
  };

  const addDescriptionRow = () => {
    formData.productDetails = [...productDescription, ""];
    setProductDescription([...productDescription, ""]);
  };

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      category: selectedCategory,
      subcategory: selectedSubCategory,
    }));
  }, [selectedCategory, selectedSubCategory]);

  const visibleFields = fields;

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
    showPopupMessage("Adding product,please wait for few seconds 😏");
    const form = new FormData();
    
    formData.tags=formData.tags!="" && formData.tags.split(",")
    console.log(formData.tags)
    // Append non-image fields
    for (let key in formData) {
      console.log(key + " " +formData[key])
      if (key === "images") continue; // skip for now
      const value = formData[key];
      form.append(
        key,
        typeof value === "object" ? JSON.stringify(value) : value
      );
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
    

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/products/create-product`,
        form,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res.status == 201) {
        showPopupMessage("Product added Successfully, Mr Bandar😏");
        setActiveView(null);
      }
    } catch (err) {
      console.log("Caught error:", err);

      let errorMessage = "Something went wrong. Please try again.";

      try {
        if (err.response && err.response.data) {
          errorMessage =
            err.response.data.errors?.map((error) => error.msg).join("\n") ||
            JSON.stringify(err.response.data);
        } else if (err.message) {
          errorMessage = err.message;
        }

        console.log("Parsed error message:", errorMessage);
      } catch (parseErr) {
        console.error("Error while parsing error:", parseErr);
      }

      try {
        showPopupMessage(`Error: ${errorMessage}`);
      } catch (popupErr) {
        console.error("Error while showing popup:", popupErr);
      }

      console.error("Final submission error:", err);
    }
  };

  return (
    <>
      {showPopup && (
        <div className="absolute top-[5px] left-[50%] -translate-x-1/2 w-full flex justify-center mt-2 z-50">
          <div className="fixed top-[70px] z-999 bg-red-100 text-black-900 px-6 py-4 rounded shadow-md text-center w-[90%] max-w-xl">
            <span className="block font-medium whitespace-pre-line">
              {popupMessage}
            </span>
          </div>
        </div>
      )}
      <form
        onClick={() => setShowPopup(false)}
        onSubmit={handleSubmit}
        className="p-6 lg:pl-10 space-y-4 max-w-full mx-auto"
      >
        <button
          onClick={() => {
            setActiveView(null);
          }}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Back
        </button>
        <h2 className="text-2xl font-semibold mb-4">Add New Product</h2>
        <div className=" rounded w-full space-y-2">
          <label className="block font-semibold mb-1">Main Category</label>
          <select
            value={categoryLevel1}
            onChange={(e) => {
              setFormData({
                ...formData,
                category: e.target.value,
              });
              setCategoryLevel1(e.target.value);
              setCategoryLevel2("");
              setCategoryLevel3("");
            }}
            className="border px-3 py-2 rounded w-full"
          >
            <option value="">Select Main Category</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        {subCategoriesLevel2.length > 0 && (
          <div className="mb-4">
            <label className="block font-semibold mb-1">Subcategory</label>
            <select
              value={categoryLevel2}
              onChange={(e) => {
                setFormData({
                  ...formData,

                  subcategory: e.target.value,
                });
                setCategoryLevel2(e.target.value);
                setCategoryLevel3("");
              }}
              className="border px-3 py-2 rounded w-full"
            >
              <option value="">Select Subcategory</option>
              {subCategoriesLevel2.map((sub, idx) => (
                <option key={idx} value={sub.name}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>
        )}
        {/* Level 3 Product Types Dropdown (if any) */}
        {subCategoriesLevel3.length > 0 && (
          <div className="mb-4">
            <label className="block font-semibold mb-1">Product Type</label>
            <select
              value={categoryLevel3}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  productType: e.target.value,
                });
                setCategoryLevel3(e.target.value);
              }}
              className="border px-3 py-2 rounded w-full"
            >
              <option value="">Select Product Type</option>
              {subCategoriesLevel3.map((type, idx) =>
                type.subTypes ? (
                  <optgroup key={idx} label={type.name}>
                    {type.subTypes.map((subType, i) => (
                      <option key={i} value={`${type.name} > ${subType}`}>
                        {subType}
                      </option>
                    ))}
                  </optgroup>
                ) : (
                  <option key={idx} value={type.name}>
                    {type.name}
                  </option>
                )
              )}
            </select>
          </div>
        )}
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
        <div>
          <h2 className="text-lg font-semibold mb-2">Product Description</h2>
          {productDescription.map((desc, index) => (
            <textarea
              key={index}
              rows={8}
              className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring"
              value={desc}
              onChange={(e) => handleDescriptionChange(index, e.target.value)}
              placeholder={`Detail ${index + 1}`}
            />
          ))}
          <button
            type="button"
            onClick={addDescriptionRow}
            className="text-blue-600 underline"
          >
            + Add More
          </button>
        </div>
        <div className="w-full">
          <h2 className="text-lg font-semibold mb-2">Specifications</h2>
          {specifications.map((spec, index) => (
            <div
              key={index}
              className="w-full flex items-center justify-between gap-2 mb-2"
            >
              <input
                className="w-[45%] border rounded-lg p-3 text-sm focus:outline-none focus:ring"
                placeholder="Subheading"
                value={spec.subHeading}
                onChange={(e) =>
                  handleSpecChange(index, "subHeading", e.target.value)
                }
              />
              <input
                className="w-[45%] border rounded-lg p-3 text-sm focus:outline-none focus:ring"
                placeholder="Value"
                value={spec.value}
                onChange={(e) =>
                  handleSpecChange(index, "value", e.target.value)
                }
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addSpecRow}
            className="text-blue-600 underline"
          >
            + Add More
          </button>
        </div>

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
          <div className="rounded w-full space-y-2">
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
              className="border px-2 py-1 rounded"
            >
              <option value="standard">Standard (e.g. S, M, L)</option>
              <option value="dimensions">
                Dimensions(e.g. Length*Breadth*Height)
              </option>
              <option value="custom">Custom</option>
            </select>

            {/* Size input field */}
            {(formData.availableSizes.format === "standard" ||
              formData.availableSizes.format === "custom") && (
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
                placeholder={`${
                  formData.availableSizes.format === "standard"
                    ? "Enter sizes (comma separated, e.g. S, M, L)"
                    : ""
                }`}
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
        )}
        {[
          "category",
          "subcategory",
          "style",
          "origin",
          "howMade",
          "delivery",
          "returns",
          "sustainability",
          "durability",
          "usage",
          "storageInstructions",
          "care",
          "warranty",
          "tags",
        ].map((field) =>
          visibleFields.includes(field) ? (
            field === "care" ? (
              <textarea
                value={formData.care}
                onChange={(e) =>
                  setFormData({ ...formData, care: e.target.value })
                }
                placeholder={`Type ${field} instructions:\nPress Enter for new line\nStart bullet points with • or -`}
                rows={8}
                className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring"
              />
            ) :field === "howMade" ? <textarea
                value={formData.howMade}
                onChange={(e) =>
                  setFormData({ ...formData, howMade: e.target.value })
                }
                placeholder={`Type ${field} instructions:\nPress Enter for new line\nStart bullet points with • or -`}
                rows={8}
                className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring"
              /> :(
              <input
                key={field}
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={field.replace(/([A-Z])/g, " $1")}
                className="border p-2 rounded w-full"
              />
            )
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
            <option value="men">Men</option>
            <option value="women">Women</option>
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
              onClick={handleAddColor}
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
    </>
  );
};

export default AddProductPanel;
