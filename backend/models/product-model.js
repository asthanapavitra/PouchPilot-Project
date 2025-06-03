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
  name: {
    type: String,
    required: true,
    unique: true,
  },
  specifications: [String],
  emi: {
    emiAvailable: {
      type: Boolean,
      default: false,
    },
    noOfMonths: [
      {
        type: Number,
        min: 3,
      },
    ],
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
  category: String,
  subcategory: String,
  productType: String,
  tags: [String],

  // Frontend-specific fields
  style: String,
  origin: String,
  productDetails: [String],
  howMade: String,
  delivery: String,
  returns: String,

  // Optional attributes based on category
  availableSizes: {
    format: {
      type: String,
      enum: ["standard", "dimensions", "custom"],
      required: true,
    },
    sizes: {
      type: [String],
      required: true,
    },
  },
  material: String,
  fragranceNotes: String,
  gender: String,
  warranty: String,
  isCustomizable: Boolean,
  kids: {
    forKids: Boolean,
    ageRange: String,
  },
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
  forOccasion: String,
  giftMessageAvailable: String,
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
