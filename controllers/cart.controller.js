const cartService = require("../services/cart.service");

exports.getCart = async (req, res) => {
  try {
    const { username } = req.params;
    const loggedInUser = req.query.loggedInUser || username;

    const result = cartService.getCartService(username, loggedInUser);

    if (!result.ok) {
      return res.status(result.status).json({ success: false, message: result.message });
    }

    return res.status(200).json({ success: true, cart: result.cart });
  } catch (err) {
    console.error("getCart error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { username } = req.params;
    const loggedInUser = req.query.loggedInUser || username;
    const { productName, quantity } = req.body;

    const result = cartService.addToCartService(username, loggedInUser, productName, quantity);

    if (!result.ok) {
      return res.status(result.status).json({ success: false, message: result.message });
    }

    return res.status(200).json({ success: true, message: "Product added to cart", cart: result.cart });
  } catch (err) {
    console.error("addToCart error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { username } = req.params;
    const loggedInUser = req.query.loggedInUser || username;
    const { productName } = req.body;

    const result = cartService.removeFromCartService(username, loggedInUser, productName);

    if (!result.ok) {
      return res.status(result.status).json({ success: false, message: result.message });
    }

    return res.status(200).json({
      success: true,
      message: `Product ${productName} removed from cart`,
      cart: result.cart,
    });
  } catch (err) {
    console.error("removeFromCart error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const { username } = req.params;
    const loggedInUser = req.body.loggedInUser || username;
    const { productName, quantity } = req.body;

    const result = cartService.updateCartService(username, loggedInUser, productName, quantity);

    if (!result.ok) {
      return res.status(result.status).json({ success: false, message: result.message });
    }

    return res.status(200).json({
      success: true,
      message: `Quantity of ${productName} updated`,
      cart: result.cart,
    });
  } catch (err) {
    console.error("updateCart error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
