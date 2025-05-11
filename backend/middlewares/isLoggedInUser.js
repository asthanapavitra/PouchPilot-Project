const jwt = require("jsonwebtoken");
const BlackListToken = require("../models/blackListToken-model");
const User = require("../models/user-model");
module.exports.isLoggedIn = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized, please login" });
    }

    const blackListToken = await BlackListToken.findOne({ token });
    if (blackListToken) {
      return res.status(401).json({ error: "Unauthorized, please login" });
    }

    let decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user = await User.findOne({ _id: decoded.id })
      .populate("cart")
      .populate("orders")
      .populate("wishlist");

    if (!user) {
      return res.status(401).json({ error: "Unauthorized, please login" });
    }

    // Convert picture buffer to base64 string

    let formattedUser = {};

    if (user.picture?.data) {
      formattedUser = {
        ...user._doc,
        picture: `data:${
          user.picture.contentType
        };base64,${user.picture.data.toString("base64")}`,
      };
    } else {
      formattedUser = user._doc;
    }
    // Format cart product images
    if (user.cart && Array.isArray(user.cart)) {
      formattedUser.cart = user.cart.map((product) => ({
        ...product._doc,
        images: product.images.map(
          (img) =>
            `data:${img.contentType};base64,${img.data.toString("base64")}`
        ),
      }));
    }

    req.user = formattedUser;
    next();
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
};
