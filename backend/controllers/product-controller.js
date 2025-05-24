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
        gallery: typecolor.gallery.map(
          (img) =>
            `data:${img.contentType};base64,${img.data.toString("base64")}`
        ),
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
      shortDescription,
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
      deliveryAndReturns,
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
      !shortDescription ||
      !price ||
      !stock ||
      !category ||
      !subcategory ||
      
      !gender
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
      shortDescription,
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
      deliveryAndReturns,
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

    const products = await productModel.find({ category: category });
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
        gallery: typecolor.gallery.map(
          (img) =>
            `data:${img.contentType};base64,${img.data.toString("base64")}`
        ),
      })),
    }));

    return res
      .status(200)
      .json({
        products: formattedProducts,
        message: "Products fetched successfully",
      });
  } catch (err) {
    return res.status(500).json({ errors: [{ message: err.message }] });
  }
};

module.exports.getProductsBySubCategory = async (req, res) => {
  try {
    const subCategory = req.params.subCategory;

    const products = await productModel.find({ subcategory: subCategory });
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
        gallery: typecolor.gallery.map(
          (img) =>
            `data:${img.contentType};base64,${img.data.toString("base64")}`
        ),
      })),
    }));

    return res
      .status(200)
      .json({
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
        gallery: typecolor.gallery.map(
          (img) =>
            `data:${img.contentType};base64,${img.data.toString("base64")}`
        ),
      })),
    };
    return res
      .status(200)
      .json({
        product: formattedProduct,
        message: "Product fetched successfully",
      });
  } catch (err) {
    return res.status(500).json({ errors: [{ message: err.message }] });
  }
};
module.exports.updateProduct=async(req,res)=>{
  try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({ errors: errors.array() });
    }
    const {id}=req.params;
    const {
      name,
      shortDescription,
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
      deliveryAndReturns,
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
      !shortDescription ||
      !price ||
      !stock ||
      !category ||
      !subcategory ||
      
      !gender
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
    const product=await productModel.findByIdAndUpdate(id,{
       name,
      shortDescription,
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
      deliveryAndReturns,
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
    })
    await product.save();
    console.log(product);
    return res.status(201).json({ message: "Product updated successfully", product });
  }
  catch(err){
    return res.status(500).json({ errors: [{ message: err.message }] });
  }
}
module.exports.deleteProduct=async(req,res)=>{
  try{
    const {id}=req.params;
    const product=await productModel.findByIdAndDelete(id);
    if(!product){
      return res.status(404).json({errors:[{message:"Product not found"}]});
    }
    return res.status(201).json({message:"Product deleted successfully"});
    
  }catch(err){
    return res.status(500).json({errors: [{ message: err.message }] });
  }
}