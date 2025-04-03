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
        return res.status(500).json({ error: "Internal server error", message: err.message });
    }
};


module.exports.createProduct = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(401).json({ errors: errors.array() });
        }

        const { name, price, description, category, brand, stock, bgColor, panelColor, textColor, isActive } = req.body;
        
        if (!name || !price || !description || !category || !brand || !stock || !bgColor || !panelColor || !textColor || isActive === undefined) {
            return res.status(400).json({ error: "Please enter all fields" });
        }

        // Convert uploaded images to buffer format
        const images = req.files.map(file => ({
            data: file.buffer, // Store image data as buffer
            contentType: file.mimetype // Store MIME type (e.g., image/png)
        }));

        const product = await productModel.create({
            name,
            price:Number(price),
            description,
            category,
            brand,
            stock:Number(stock),
            bgColor,
            panelColor,
            textColor,
            images,
            isActive: isActive === "true" || isActive === true, // Convert string to boolean
        });

        return res.status(200).json({ message: "Product created successfully", product });
    } catch (err) {
        return res.status(500).json({ error: "Internal server error", message: err.message });
    }
};
