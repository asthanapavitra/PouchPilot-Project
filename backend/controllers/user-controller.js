const { validationResult } = require("express-validator");
const User = require("../models/user-model");
const BlackListToken=require('../models/blackListToken-model')
module.exports.registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({ errors: errors.array() });
    }

    const { email, password, userName } = req.body;
    if(!email||!password||!userName){
      return res.status(400).json({errors:[{message:"Please enter all fields"}]});
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({errors:[{ message: "Invalid Email or password" }]});
    }
    const newUser = await User.create({
      email,
      password:await User.hashPassword(password),
      userName,
    });
    newUser.password=undefined;
    return res
      .status(200)
      .json({ message: "User created successfully", user: newUser });
  } catch (err) {
    return res
      .status(500)
      .json({errors:[ {message: err.message }]});
  }
};
module.exports.loginUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(401).json({ errors: errors.array() });
        }

        const { identifier, password } = req.body;
        if (!identifier || !password) {
            return res.status(400).json({ errors: [{message: "Please enter all fields"}] });
        }

        // Check if identifier is an email or a usernames
        let user=await User.findOne({email:identifier}).select("+password");
        if(!user){
            user = await User.findOne({ userName: identifier }).select("+password");
        }
        if (!user) {
            return res.status(400).json({ errors:[ {message:"Invalid credentials"}] });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ errors: [{message:"Invalid credentials"}] });
        }

        const token = user.generateToken();
        res.cookie("token", token, {
            httpOnly: true
        });
        user.password=undefined;
        return res.status(200).json({ message: "User logged in successfully", user, token });
    } catch (err) {
        return res.status(500).json({errors:[{  message: err.message }]});
    }
};


module.exports.addToCart = async (req, res) => {
  try {
    const id = req.params.id;

    // Fetch full user document
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ errors: [{ message: "User not found" }] });
    }

    if (user.cart.includes(id)) {
      return res
        .status(400)
        .json({ errors: [{ message: "Item already in cart" }] });
    }

    user.cart.push(id);
    await user.save();

    return res.status(200).json({ message: "Item added to cart successfully" });
  } catch (err) {
    return res.status(500).json({ errors: [{ message: err.message }] });
  }
};

module.exports.removeFromCart=async(req,res)=>{
  try{
    const id=req.params.id;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ errors: [{ message: "User not found" }] });
    }

    const index=user.cart.indexOf(id);
    if(index===-1){
      return res.status(404).json({errors:[{message:"Item not found in cart"}]});
    }
    user.cart.splice(index,1);
    await user.save();
    return res.status(200).json({message:"Item removed from cart successfully"});
  }
  catch(err){
    return res.status(500).json({errors:[{message:err.message}]});
  }
}
module.exports.logoutUser=async (req,res)=>{
    try{
        const token=req.cookies.token||req.headers.authorization?.split(" ")[1];
        if(!token){
            return res.status(401).json({errors:[{message:"Unauthorized,please login"}]});
        }
        await BlackListToken.create({token});
        res.clearCookie("token");
        return res.status(200).json({message:"User logged out successfully"});
    }catch(err){
      return res.status(500).json({errors:[{message:err.message}]});
    }
}



module.exports.updateProfile= async (req, res) => {
  try {
    const userId = req.user._id; // assuming authenticateUser adds `req.user`
    const user = await User.findById({_id:userId});

    if (!user) return res.status(404).json({ message: "User not found" });

    // Update fields
    const {fullName,address,contact}=req.body;
    console.log(fullName,address,contact);
    user.fullName=fullName;
    user.address=address;
    user.contact=contact;
    

    // Update contact
   console.log(req.file);
    // Update profile picture
    if (req.file) {
      user.picture.data = req.file.buffer;
      user.picture.contentType = req.file.mimetype;
    }

    await user.save();
    console.log(user)
    res.status(200).json({ message: "Profile updated", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
