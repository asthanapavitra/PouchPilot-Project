const { validationResult } = require("express-validator");
const Admin = require("../models/admin-model");
const BlackListToken = require("../models/blackListToken-model");
module.exports.registerAdmin = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({ errors: errors.array() });
    }

    const { email, password, userName} = req.body;
    if (!email || !password || !userName) {
      return res.status(400).json({ errors: [{message:"Please enter all fields" }]});
    }
    let admin = await Admin.find();
    if (admin.length > 0) {
      return res
        .status(503)
        .json({ errors: [{message:"Donot have permission to create admin"}] });
    }
    admin = await Admin.findOne({ email });
    if (admin) {
      return res.status(400).json({ errors: [{message:"Invalid Email or password" }]});
    }
    const newAdmin = await Admin.create({
      email,
      password: await Admin.hashPassword(password),
      userName,
    });
    newAdmin.password=undefined;
    return res
      .status(200)
      .json({ message: "Admin created successfully", admin: newAdmin });
  } catch (err) {
    return res
      .status(500)
      .json({ errors:[{message: err.message}] });
  }
};
module.exports.loginAdmin = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({ errors: errors.array() });
    }
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ errors: [{message:"Please enter all fields" }]});
    }

    // Check if identifier is an email or a username
    let admin = await Admin.findOne({ email: identifier }).select("+password");
    if (!admin) {
      admin = await Admin.findOne({ userName: identifier }).select("+password");
    }
    if (!admin) {
      return res.status(400).json({ errors: [{message:"Invalid credentials" }]});
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ errors: [{message:"Invalid Email or password"}] });
    }
    const token = admin.generateToken();
    res.cookie("token", token, {
      httpOnly: true,
    });
    admin.password=undefined;
    return res
      .status(200)
      .json({ message: "Admin logged in successfully", admin, token });
  } catch (err) {
    return res
      .status(500)
      .json({ errors:[{message: err.message}] });
  }
};

module.exports.logoutAdmin = async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ errors: [{message:"Unauthorized,please login"}] });
    }
    await BlackListToken.create({ token });
    res.clearCookie("token");
    return res.status(200).json({ message: "Admin logged out successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ errors: [{message: err.message}] });
  }
};
