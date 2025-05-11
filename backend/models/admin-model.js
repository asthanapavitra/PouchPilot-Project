const mongoose = require("mongoose");
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const adminSchema = mongoose.Schema({
  fullName: {
    firstName: {
      type: String,
      
      minLength: 3,
      trim: true,
    },
    lastName: {
      type: String,
      minLength: 3,
      trim: true,
    },
  },
  userName: {
    type: String,
    unique: true,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
  ],

  picture: {
    type: Buffer,
   contentType:String
  },

  gstin: String,
});
adminSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};
adminSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
adminSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};
module.exports = mongoose.model("admin", adminSchema);
