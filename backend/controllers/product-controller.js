const productModel = require("../models/product-model");
const { validationResult } = require("express-validator");

module.exports.getAllProducts = async (req, res) => {
  try {
    const products = await productModel.find();

    // Convert buffer images to base64
    const formattedProducts = products.map((product) => ({
      ...product._doc,
      images: product.images.map((typecolor) => ({
        color: typecolor.color,
        gallery: typecolor.gallery.map((img) => ({
          src: `data:${img.contentType};base64,${img.data.toString("base64")}`,
          id: img._id, // ✅ This is what you were missing
        })),
      })),
    }));

    return res.status(200).json({
      products: formattedProducts,
      message: "Products fetched successfully",
    });
  } catch (err) {
    return res.status(500).json({ errors: [{ message: err.message }] });
  }
};

module.exports.createProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({ errors: errors.array() });
    }

    const {
      name,
      specifications,
      emi,
      price,
      discount,
      stock,
      category,
      subcategory,
      productType,
      tags,
      style,
      origin,
      productDetails,
      howMade,
      delivery,
      returns,
      availableSizes,
      material,
      fragranceNotes,
      gender,
      warranty,
      isCustomizable,
      kids,
      sustainability,
      durability,
      usage,
      storageInstructions,
      care,
      isActive,
    } = req.body;

    if (
      !name ||
      !price ||
      !stock ||
      !category ||
      !subcategory ||
      !gender ||
      !productType
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Parse and group image files
    const imagesMeta = JSON.parse(req.body.imagesMeta || "[]");
    const files = req.files.images || [];
    const images = [];

    imagesMeta.forEach(({ color, index }) => {
      const file = files[index];
      if (!file) return;
      let entry = images.find((img) => img.color === color);
      if (!entry) {
        entry = { color, gallery: [] };
        images.push(entry);
      }
      entry.gallery.push({
        data: file.buffer,
        contentType: file.mimetype,
      });
    });

    const product = await productModel.create({
      name,
      specifications: specifications ? specifications : [],
      price: Number(price),
      discount: discount ? Number(discount) : 0,
      stock: Number(stock),
      category,
      subcategory,
      productType,
      tags: tags ? tags : [],

      style,
      origin,
      productDetails: productDetails ? productDetails : [],
      howMade,
      delivery,
      returns,
      availableSizes: availableSizes ? availableSizes : [],
      material,
      fragranceNotes,
      gender,
      warranty,
      isCustomizable: isCustomizable === "true" || isCustomizable === true,
      kids: kids ? kids : {},
      sustainability,
      durability,
      usage,
      storageInstructions,
      care,
      isActive: isActive === "true" || isActive === true,
      images, // ✅ Correct structured image data
      emi: emi ? emi : { emiAvailable: false, noOfMonths: [] },
    });

    return res
      .status(201)
      .json({ message: "Product created successfully", product });
  } catch (err) {
    return res.status(500).json({ errors: [{ message: err.message }] });
  }
};

module.exports.getProductsByCategory = async (req, res) => {
  try {
    const category = req.params.category;

    const products = await productModel.find({
      category: category.trim().toLowerCase(),
    });
    if (products.length === 0) {
      return res
        .status(404)
        .json({ errors: [{ message: "No products found" }] });
    }
    // Convert buffer images to base64

    const formattedProducts = products.map((product) => ({
      ...product._doc,
      images: product.images.map((typecolor) => ({
        color: typecolor.color,
        gallery: typecolor.gallery.map((img) => ({
          src: `data:${img.contentType};base64,${img.data.toString("base64")}`,
          id: img._id, // ✅ This is what you were missing
        })),
      })),
    }));

    return res.status(200).json({
      products: formattedProducts,
      message: "Products fetched successfully",
    });
  } catch (err) {
    return res.status(500).json({ errors: [{ message: err.message }] });
  }
};

module.exports.getProductByCriteria = async (req, res) => {
  try {
    const criteria = req.query.criteria || req.params.criteria; // Adjust as per route setup

    if (!criteria) {
      return res
        .status(400)
        .json({ errors: [{ message: "Criteria is required" }] });
    }

    // Fetch all products from DB
    const products = await productModel.find(); // Adjust if you're filtering earlier

    // 1. Filter products that match any of the fields
    const matchedProducts = products.filter(
      (product) =>
        product.category === criteria ||
        product.subcategory === criteria ||
        product.productType === criteria
    );

    // 2. Pick one product per productType
    const seenProductTypes = new Set();
    const filteredProducts = [];

    matchedProducts.forEach((product) => {
      if (!seenProductTypes.has(product.productType)) {
        seenProductTypes.add(product.productType);
        filteredProducts.push(product);
      }
    });

    // 3. Format image data
    const formattedProducts = filteredProducts.map((product) => ({
      ...product._doc,
      images: product.images.map((typecolor) => ({
        color: typecolor.color,
        gallery: typecolor.gallery.map((img) => ({
          src: `data:${img.contentType};base64,${img.data.toString("base64")}`,
          id: img._id,
        })),
      })),
    }));

    return res.status(200).json({
      products: formattedProducts,
      message: "Products fetched successfully",
    });
  } catch (err) {
    return res.status(500).json({ errors: [{ message: err.message }] });
  }
};

module.exports.getProductsBySubCategoryAndProductType = async (req, res) => {
  try {
    const { category, subCategory, productType } = req.params;

    // Construct a query object dynamically
    const query = {
      category: new RegExp(`^${category}$`, "i"),
      subcategory: new RegExp(`^${subCategory}$`, "i"),
      productType: new RegExp(`^${productType}$`, "i"),
    };
    const products = await productModel.find(query);
    if (products.length === 0) {
      return res
        .status(404)
        .json({ errors: [{ message: "No products found" }] });
    }
    // Convert buffer images to base64

    const formattedProducts = products.map((product) => ({
      ...product._doc,
      images: product.images.map((typecolor) => ({
        color: typecolor.color,
        gallery: typecolor.gallery.map((img) => ({
          src: `data:${img.contentType};base64,${img.data.toString("base64")}`,
          id: img._id, // ✅ This is what you were missing
        })),
      })),
    }));

    return res.status(200).json({
      products: formattedProducts,
      message: "Products fetched successfully",
    });
  } catch (err) {
    return res.status(500).json({ errors: [{ message: err.message }] });
  }
};
module.exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ errors: [{ message: "Product not found" }] });
    }
    // Convert buffer images to base64
    const formattedProduct = {
      ...product._doc,
      images: product.images.map((typecolor) => ({
        color: typecolor.color,
        gallery: typecolor.gallery.map((img) => ({
          src: `data:${img.contentType};base64,${img.data.toString("base64")}`,
          id: img._id, // ✅ This is what you were missing
        })),
      })),
    };

    return res.status(200).json({
      product: formattedProduct,
      message: "Product fetched successfully",
    });
  } catch (err) {
    return res.status(500).json({ errors: [{ message: err.message }] });
  }
};
module.exports.updateProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({ errors: errors.array() });
    }

    const { id } = req.params;

    // Extract form fields
    const {
      name,
      specifications,
      emi,
      price,
      discount,
      stock,
      category,
      subcategory,
      tags,
      style,
      origin,
      productDetails,
      howMade,
      delivery,
      returns,
      availableSizes,
      material,
      fragranceNotes,
      gender,
      warranty,
      isCustomizable,
      kids,
      sustainability,
      durability,
      usage,
      storageInstructions,
      care,
      isActive,
    } = req.body;

    if (!name || !price || !stock || !category || !subcategory || !gender) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const imagesMeta = JSON.parse(req.body.imagesMeta || "[]");
    const removedImages = JSON.parse(req.body.removedImages || "[]");

    const files = req.files?.newImages || [];

    const existingProduct = await productModel.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    const mergedImagesMap = new Map();

    // Step 1: Start with existing images
    // Step 1: Start with existing images (excluding removed ones)
    existingProduct.images.forEach(({ color, gallery }) => {
      const filteredGallery = gallery.filter(
        (img) => !removedImages.includes(String(img._id))
      );
      if (filteredGallery.length > 0) {
        mergedImagesMap.set(color, filteredGallery);
      }
    });

    // Step 2: Add new images from form (if any)
    imagesMeta.forEach(({ color, index, isNew }) => {
      const file = files[index];
      if (isNew && file) {
        const newImage = {
          data: file.buffer,
          contentType: file.mimetype,
        };
        if (mergedImagesMap.has(color)) {
          mergedImagesMap.get(color).push(newImage);
        } else {
          mergedImagesMap.set(color, [newImage]);
        }
      }
    });

    // Step 3: Construct the `images` array for DB
    const updatedImages = Array.from(mergedImagesMap.entries()).map(
      ([color, gallery]) => ({
        color,
        gallery,
      })
    );

    // Update fields and save
    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      {
        name,
        specifications: specifications ? specifications : [],
        price: Number(price),
        discount: discount ? Number(discount) : 0,
        stock: Number(stock),
        category,
        subcategory,
        tags: tags ? tags : [],
        style,
        origin,
        productDetails: productDetails ? productDetails : [],
        howMade,
        delivery,
        returns,
        availableSizes: availableSizes ? availableSizes : [],
        material,
        fragranceNotes,
        gender,
        warranty,
        isCustomizable: isCustomizable === "true" || isCustomizable === true,
        kids: kids ? kids : {},
        sustainability,
        durability,
        usage,
        storageInstructions,
        care,
        isActive: isActive === "true" || isActive === true,
        images: updatedImages,
        emi: emi ? emi : { emiAvailable: false, noOfMonths: [] },
      },
      { new: true }
    );

    await updatedProduct.save();

    return res.status(201).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (err) {
    return res.status(500).json({ errors: [{ message: err.message }] });
  }
};

module.exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findByIdAndDelete(id);
    if (!product) {
      return res
        .status(404)
        .json({ errors: [{ message: "Product not found" }] });
    }
    return res.status(201).json({ message: "Product deleted successfully" });
  } catch (err) {
    return res.status(500).json({ errors: [{ message: err.message }] });
  }
};
