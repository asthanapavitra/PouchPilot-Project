const mongoose = require("mongoose");
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const defaultImagePath = "./images/default-profile-pic.png";
const defaultImage = fs.readFileSync(defaultImagePath);
const userSchema = new mongoose.Schema({
  fullName:{
    firstName:{
        type:String,
       
        minLength:3,
        trim:true
    },
    lastName:{
        type:String,
        minLength:3,
        trim:true
    }
},
  userName:{
    type:String,
    unique:true,
    trim:true,
    required:true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minLength: [6, "Password must be atleast 6 characters long"],
    trim: true,
    select: false,
  },
  cart: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
  ],
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
  ],
  address: [
    {
      type: String,
    },
  ],
  picture: {
    type: Buffer,
    default: defaultImage,
  },

  contact: {
    countryCode: {
      type: Number,
      minLength: [1, "Country code must be atleast 2 digits long"],
      maxLength: [4, "Country code must be atleast 2 digits long"],
    },
    contactNumber: {
      type: Number,
      minLength: [10, "Contact number must be 10 digits long"],
      maxLength: [10, "Contact number must be 10 digits long"],
    },
    countryFlag:{
      type:Buffer
    }
  },
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
  ],
});
userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};
module.exports = mongoose.model("user", userSchema);
