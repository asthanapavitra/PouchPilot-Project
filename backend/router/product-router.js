const express = require('express');
const router = express.Router();
const productController = require('../controllers/product-controller');
const { body } = require('express-validator');
const upload = require('../config/multer-config');

router.get('/',productController.getAllProducts)

router.post(
  '/create-product',
  upload.fields([
    { name: 'images'}, // Main images
    { name: 'imageGallery' } // Additional gallery images
  ]),
  [
    body('name')
      .isLength({ min: 3 })
      .withMessage('Product name must be at least 3 characters long'),

    body('shortDescription')
      .isLength({ min: 10 })
      .withMessage('Short description must be at least 10 characters long'),

    body('price')
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),

    body('discount')
      .optional()
      .isFloat({ min: 0, max: 100 })
      .withMessage('Discount must be between 0 and 100'),

    body('stock')
      .isInt({ min: 0 })
      .withMessage('Stock must be a non-negative integer'),

      body('category')
      .custom(value => {
        const validCategories = ['bags', 'sneakers', 'watches', 'perfumes', 'gifts', 'merchandise'];
        if (!validCategories.includes(value.toLowerCase())) {
          throw new Error('Invalid product category');
        }
        return true;
      })
,    
    body('subcategory')
      .optional()
      .isString()
      .withMessage('Subcategory must be a string'),

   

    body('color')
      .optional()
      .isString(),

    body('style')
      .optional()
      .isString(),

    body('origin')
      .optional()
      .isString(),

    

    body('howMade')
      .optional()
      .isString(),

    body('deliveryAndReturns')
      .optional()
      .isString(),

    body('availableColors')
      .optional()
      .isString(),

    body('size')
      .optional()
      .isString(),

    body('material')
      .optional()
      .isString(),

    body('fragranceNotes')
      .optional()
      .isString(),

    body('gender')
      .optional()
      .isString(),

    body('warranty')
      .optional()
      .isString(),

    body('isCustomizable')
      .optional()
      .isBoolean()
      .withMessage('isCustomizable must be a boolean'),

    body('sustainability')
      .optional()
      .isString(),

    body('durability')
      .optional()
      .isString(),

    body('usage')
      .optional()
      .isString(),

    body('storageInstructions')
      .optional()
      .isString(),

    body('care')
      .optional()
      .isString(),

    body('isActive')
      .optional()
      .isBoolean()
      .withMessage('isActive must be a boolean'),
  ],
  productController.createProduct
);

router.get('/get-products-by-category/:category',productController.getProductsByCategory);
router.get('/get-products-by-subcategory/:subCategory',productController.getProductsBySubCategory);
router.get('/get-product-by-id/:id', productController.getProductById);
module.exports = router;
