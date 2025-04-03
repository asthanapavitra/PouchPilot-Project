const mongoose = require("mongoose");
const productSchema = mongoose.Schema({
  images: [
    {
      data: Buffer,
      contentType: String, // Store MIME type (image/png, image/jpeg)
    },
  ],

  name: {
    type: String,
    required: true, // Product name is required
    unique: true, // Product name must be unique
  },
  price: {
    type: Number,
    required: true, // Product price is required},
    min: 0,
  },
  discount: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  }, // Defines the number of available products of this type
  rating: Number,
  bgColor: {
    type: String,
    required: true,
  },

  panelColor: {
    type: String,
    required: true,
  },
  textColor: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }, // Timestamp for when the product was created
  reviews: [
    {
      userId: mongoose.Schema.Types.ObjectId,
      review: String,
      rating: Number,
      images: [{
        type: Buffer,
        contentType: String, // Store MIME type (image/png, image/jpeg)
      }], // Array of images related to the review
      createdAt: {
        type: Date,
        default: Date.now,
      }, // Timestamp for when the review was created
    },
  ],
  updatedAt: {
    type: Date,
    default: Date.now,
  }, // Timestamp for when the product was last updated
  isActive: {
    type: Boolean,
    default: true,
  }, // Indicates if the product is active or discontinued
  tags: [String], // Array of tags for better search and categorization (e.g., "sale", "new", "popular")
});
module.exports = mongoose.model("product", productSchema);
