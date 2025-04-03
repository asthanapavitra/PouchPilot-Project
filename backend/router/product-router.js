const express = require('express');
const router = express.Router();
const productController = require('../controllers/product-controller');
const { body } = require('express-validator');
const upload = require('../config/multer-config');

router.get('/', productController.getAllProducts);

router.post(
    '/create-product',
    upload.array('images'),  // Move multer before validation
    [
        body('name').isLength({ min: 3 }).withMessage("Product name must be at least 3 characters long"),
        body('price') .custom(value => !isNaN(value)) // Custom validation to allow numbers as strings
        .withMessage("Product price must be a number"),
        body('description').isLength({ min: 10 }).withMessage("Product description must be at least 10 characters long"),
        body('category').isLength({ min: 3 }).withMessage("Product category must be at least 3 characters long"),
        body('brand').isLength({ min: 3 }).withMessage("Product brand must be at least 3 characters long"),
        body('stock') .custom(value => !isNaN(value)) // Custom validation to allow numbers as strings
        .withMessage(" Stocks must be a number"),
        body('bgColor').isLength({ min: 3 }).withMessage("Product bgColor must be at least 3 characters long"),
        body('panelColor').isLength({ min: 3 }).withMessage("Product panelColor must be at least 3 characters long"),
        body('textColor').isLength({ min: 3 }).withMessage("Product textColor must be at least 3 characters long"),
        body('isActive') .custom(value => value === "true" || value === "false" || typeof value === "boolean")
        .withMessage("Product isActive must be a boolean"),
    ],
    productController.createProduct
);

module.exports = router;
