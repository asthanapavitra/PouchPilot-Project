const express = require("express");
const router = express.Router();
const productController = require("../controllers/product-controller");
const { body } = require("express-validator");
const upload = require("../config/multer-config");
const isAdminLoggedIn = require("../middlewares/isLoggedInAdmin").isLoggedIn;
function parseJsonFields(req, res, next) {
  const jsonFields = [
    "tags",
    "productDetails",
    "emi",
    "kids",
    "availableSizes",
    "specifications",
  ];

  for (const field of jsonFields) {
    if (
      req.body[field] &&
      typeof req.body[field] === "string" &&
      req.body[field].trim() !== ""
    ) {
      try {
        req.body[field] = JSON.parse(req.body[field]);
      } catch (err) {
        return res.status(400).json({
          error: `Invalid JSON in field "${field}": ${err.message}`,
        });
      }
    }
  }

  next();
}

router.get("/", productController.getAllProducts);

router.post(
  "/create-product",

  upload.fields([{ name: "images" }]),
  parseJsonFields,
  [
    body("name")
      .isLength({ min: 3 })
      .withMessage("Product name must be at least 3 characters long"),

    body("price")
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number"),

    body("discount")
      .optional()
      .isFloat({ min: 0, max: 100 })
      .withMessage("Discount must be between 0 and 100"),

    body("stock")
      .isInt({ min: 0 })
      .withMessage("Stock must be a non-negative integer"),

    body("category")
      .optional()
      .isString()
      .withMessage("Category must be a string"),
    body("subcategory")
      .optional()
      .isString()
      .withMessage("Subcategory must be a string"),

    body("availableSizes")
      .optional()
      .isObject()
      .withMessage("availableSizes must be an object"),

   

    body("productDetails")
      .optional()
      .isArray()
      .withMessage("productDetails must be an array of bullet points"),
    body("specifications")
      .optional()
      .isArray()
      .withMessage("specifications must be an array"),

    body("emi").optional().isObject().withMessage("emi must be an object"),

    body("emi.emiAvailable")
      .optional()
      .isBoolean()
      .withMessage("emiAvailable must be a boolean"),

    body("emi.noOfMonths")
      .optional()
      .isArray()
      .withMessage("noOfMonths must be an array"),

    body("kids").optional().isObject().withMessage("kids must be an object"),

    body("kids.forKids")
      .optional()
      .isBoolean()
      .withMessage("forKids must be a boolean"),

    body("kids.ageRange")
      .optional()
      .isString()
      .withMessage("ageRange must be a string"),

    body("material").optional().isString(),
    body("fragranceNotes").optional().isString(),
    body("gender").optional().isString(),
    body("warranty").optional().isString(),
    body("style").optional().isString(),
    body("origin").optional().isString(),
    body("howMade").optional().isString(),
    body("delivery").optional().isString(),
    body("returns").optional().isString(),
    body("sustainability").optional().isString(),
    body("durability").optional().isString(),
    body("usage").optional().isString(),
    body("storageInstructions").optional().isString(),
    body("care").optional().isString(),
    body("isCustomizable").optional().isBoolean(),
    body("isActive").optional().isBoolean(),
  ],
  isAdminLoggedIn,
  productController.createProduct
);

router.put(
  "/update-product/:id",
  upload.fields([{ name: "newImages" }]),
  parseJsonFields,
  [
    body("name")
      .isLength({ min: 3 })
      .withMessage("Product name must be at least 3 characters long"),

    body("specifications")
      .optional()
      .isArray()
      .withMessage("specifications must be an array"),

    body("price")
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number"),

    body("discount")
      .optional()
      .isFloat({ min: 0, max: 100 })
      .withMessage("Discount must be between 0 and 100"),

    body("stock")
      .isInt({ min: 0 })
      .withMessage("Stock must be a non-negative integer"),

    body("category")
      .trim()
      .toLowerCase()
      .custom((value) => {
        const valid = [
          "bags",
          "sneakers",
          "watches",
          "perfumes",
          "gifts",
          "merchandise",
        ];
        if (!valid.includes(value)) {
          throw new Error("Invalid product category");
        }
        return true;
      }),
    body("subcategory")
      .optional()
      .isString()
      .withMessage("Subcategory must be a string"),

    body("availableSizes")
      .optional()
      .isObject()
      .withMessage("availableSizes must be an object"),

    body("availableSizes.sizes")
      .optional()
      .isArray()
      .withMessage("availableSizes.sizes must be an array")
      .custom((arr) => arr.every((s) => typeof s === "string"))
      .withMessage("Each size must be a string"),

    body("productDetails")
      .optional()
      .isArray()
      .withMessage("productDetails must be an array of bullet points"),

    body("emi").optional().isObject().withMessage("emi must be an object"),

    body("emi.emiAvailable")
      .optional()
      .isBoolean()
      .withMessage("emiAvailable must be a boolean"),

    body("emi.noOfMonths")
      .optional()
      .isArray()
      .withMessage("noOfMonths must be an array"),

    body("kids").optional().isObject().withMessage("kids must be an object"),

    body("kids.forKids")
      .optional()
      .isBoolean()
      .withMessage("forKids must be a boolean"),

    body("kids.ageRange")
      .optional()
      .isString()
      .withMessage("ageRange must be a string"),

    body("material").optional().isString(),
    body("fragranceNotes").optional().isString(),
    body("gender").optional().isString(),
    body("warranty").optional().isString(),
    body("style").optional().isString(),
    body("origin").optional().isString(),
    body("howMade").optional().isString(),
    body("delivery").optional().isString(),
    body("returns").optional().isString(),
    body("sustainability").optional().isString(),
    body("durability").optional().isString(),
    body("usage").optional().isString(),
    body("storageInstructions").optional().isString(),
    body("care").optional().isString(),
    body("isCustomizable").optional().isBoolean(),
    body("isActive").optional().isBoolean(),
  ],
  isAdminLoggedIn,
  productController.updateProduct
);
router.get(
  "/get-products-by-category/:category",
  productController.getProductsByCategory
);
router.delete(
  "/delete-product/:id",
  isAdminLoggedIn,
  productController.deleteProduct
);
router.get(
  "/get-products-by-subcategory-productType/:category/:subCategory/:productType",
  productController.getProductsBySubCategoryAndProductType
);
router.get("/get-product-by-id/:id", productController.getProductById);
router.get(
  "/get-Oneproduct-forType/:criteria",
  productController.getProductByCriteria
);
module.exports = router;
