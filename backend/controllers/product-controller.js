const productModel = require('../models/product-model');
const { validationResult } = require('express-validator');

module.exports.getAllProducts = async (req, res) => {
    try {
        const products = await productModel.find();
        
        // Convert buffer images to base64
        const formattedProducts = products.map(product => ({
            ...product._doc,
            images: product.images.map(img => `data:${img.contentType};base64,${img.data.toString('base64')}`)
        }));

        return res.status(200).json({
            products: formattedProducts,
            message: "Products fetched successfully"
        });
    } catch (err) {
        return res.status(500).json({ errors:[{message: err.message}] });
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
      price,
      discount,
      stock,
      category,
      subcategory,
      tags,
      color,
      style,
      origin,
      productDetails,
      howMade,
      deliveryAndReturns,
      availableColors,
      size,
      material,
      fragranceNotes,
      gender,
      warranty,
      isCustomizable,
      sustainability,
      durability,
      usage,
      storageInstructions,
      care,
      isActive,
    } = req.body;

    if (!name || !shortDescription || !price || !stock || !category) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Destructure uploaded files
    const { images = [], imageGallery = [], ...otherFiles } = req.files || {};

    const imagesBuffer = images.map(file => ({
      data: file.buffer,
      contentType: file.mimetype,
    }));

    const imageGalleryBuffer = imageGallery.map(file => ({
      data: file.buffer,
      contentType: file.mimetype,
    }));

    // 💡 Process colorImages: structure => { color: [ {data, contentType}, ... ] }
    const colorImages = {};
    Object.keys(otherFiles).forEach(fieldName => {
      if (fieldName.startsWith("colorImages[")) {
        const color = fieldName.match(/colorImages\[(.*?)\]/)[1];
        colorImages[color] = otherFiles[fieldName].map(file => ({
          data: file.buffer,
          contentType: file.mimetype,
        }));
      }
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
      color,
      style,
      origin,
      productDetails: productDetails ? productDetails : [],
      howMade,
      deliveryAndReturns,
      availableColors: availableColors ? availableColors : [],
      size,
      material,
      fragranceNotes,
      gender,
      warranty,
      isCustomizable: isCustomizable === 'true' || isCustomizable === true,
      sustainability,
      durability,
      usage,
      storageInstructions,
      care,
      isActive: isActive === 'true' || isActive === true,
      images: imagesBuffer,
      imageGallery: imageGalleryBuffer,
      colorImages // ✅ store color-associated images
    });

    return res.status(200).json({ message: "Product created successfully", product });

  } catch (err) {
    return res.status(500).json({ errors: [{ message: err.message }] });
  }
};


module.exports.getProductsByCategory=async(req,res)=>{
    try{
        const category=req.params.category;
       
        const products=await productModel.find({category:category});
        if(products.length===0){
            return res.status(404).json({errors:[{message:"No products found"}]});
        }
        // Convert buffer images to base64

        const formattedProducts = products.map(product => ({
            ...product._doc,
            images: product.images.map(img => `data:${img.contentType};base64,${img.data.toString('base64')}`)
        }));
  
        return res.status(200).json({products:formattedProducts,message:"Products fetched successfully"});
    }
    catch(err){
        return res.status(500).json({ errors:[{message: err.message}] });
    }
}

module.exports.getProductsBySubCategory=async(req,res)=>{
    try{
        const subCategory=req.params.subCategory;
       
        const products=await productModel.find({subcategory:subCategory});
        if(products.length===0){
            return res.status(404).json({errors:[{message:"No products found"}]});
        }
        // Convert buffer images to base64

        const formattedProducts = products.map(product => ({
            ...product._doc,
            images: product.images.map(img => `data:${img.contentType};base64,${img.data.toString('base64')}`)
        }));
  
        return res.status(200).json({products:formattedProducts,message:"Products fetched successfully"});
    }
    catch(err){
        return res.status(500).json({ errors:[{message: err.message}] });
    }
}
module.exports.getProductById=async(req,res)=>{
    try{
        const {id}=req.params;
        const product=await productModel.findById(id);
        if(!product){
            return res.status(404).json({errors:[{message:"Product not found"}]});
        }
        // Convert buffer images to base64
        const formattedProduct = {
            ...product._doc,
            images: product.images.map(img => `data:${img.contentType};base64,${img.data.toString('base64')}`)
        };
        return res.status(200).json({product:formattedProduct,message:"Product fetched successfully"});
    }
    catch(err){
        return res.status(500).json({ errors:[{message: err.message}] });
    }
}