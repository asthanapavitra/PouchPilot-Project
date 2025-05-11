const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  images: [
    {
      color: String,
      gallery: [
        {
          data: Buffer,
          contentType: String,
        },
      ],
    },
  ],

  // ✅ New imageGallery field
  imageGallery: [
    {
      data: Buffer,
      contentType: String,
    },
  ],

  name: {
    type: String,
    required: true,
    unique: true,
  },
  shortDescription: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  discount: {
    type: Number,
    default: 0,
  },
  stock: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: ["bags", "sneakers", "watches", "perfumes", "gifts", "merchandise"],
    required: true,
  },
  subcategory: {
    type: String,
  },
  tags: [String],

  // Frontend-specific fields
  style: String,
  origin: String,
  productDetails: [String],
  howMade: String,
  deliveryAndReturns: String,

  // Optional attributes based on category
  availableColors: [String],
  availableSizes: [String],
  material: String,
  fragranceNotes: String,
  gender: String,
  warranty: String,
  isCustomizable: Boolean,

  // Additional product metadata
  rating: Number,
  sustainability: String,
  durability: String,
  usage: String,
  storageInstructions: String,
  care: String,
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },

  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "review",
    },
  ],
});

module.exports = mongoose.model("product", productSchema);
