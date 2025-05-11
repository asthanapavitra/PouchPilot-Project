const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  reviewText: {
    type: String,
    trim: true,
    required: true,
  },
  images: [
    {
      data: Buffer,
      contentType: String,
    }
  ],
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Review = mongoose.model("review", reviewSchema);
module.exports = Review;
