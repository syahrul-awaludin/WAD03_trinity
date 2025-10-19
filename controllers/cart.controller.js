const cartService = require("../services/cart.service");

// helper for error mapping
function mapErrorToResponse(err) {
  switch (err.message) {
    case "USER_NOT_FOUND":
      return { status: 404, message: "User not found" };
    case "FORBIDDEN_ROLE":
      return { status: 403, message: "Only buyers can access cart" };
    case "FORBIDDEN_ACCESS":
      return { status: 403, message: "You cannot access someone else's cart" };
    case "MISSING_FIELDS":
      return { status: 400, message: "productName and quantity are required" };
    case "INVALID_QUANTITY":
      return { status: 400, message: "quantity must be a positive integer" };
    case "PRODUCT_NOT_FOUND":
      return { status: 404, message: "Product not found" };
    case "CART_NOT_FOUND":
      return { status: 404, message: "Cart not found" };
    case "MISSING_PRODUCT":
      return { status: 400, message: "productName is required" };
    case "ITEM_NOT_FOUND":
      return { status: 404, message: "Product not found in cart" };
    default:
      return { status: 500, message: "Internal Server Error" };
  }
}

exports.getCart = async (req, res) => {
  try {
    const { username } = req.params;
    const loggedInUser = req.query.loggedInUser || username;
    const cart = cartService.getCartService(username, loggedInUser);
    res.status(200).json({ success: true, cart });
  } catch (err) {
    console.error("getCart error:", err.message);
    const { status, message } = mapErrorToResponse(err);
    res.status(status).json({ success: false, message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { username } = req.params;
    const loggedInUser = req.query.loggedInUser || username;
    const { productName, quantity } = req.body;

    const cart = cartService.addToCartService(username, loggedInUser, productName, quantity);
    res.status(200).json({ success: true, message: "Product added to cart", cart });
  } catch (err) {
    console.error("addToCart error:", err.message);
    const { status, message } = mapErrorToResponse(err);
    res.status(status).json({ success: false, message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { username } = req.params;
    const loggedInUser = req.query.loggedInUser || username;
    const { productName } = req.body;

    const cart = cartService.removeFromCartService(username, loggedInUser, productName);
    res.status(200).json({
      success: true,
      message: `Product ${productName} removed from cart`,
      cart,
    });
  } catch (err) {
    console.error("removeFromCart error:", err.message);
    const { status, message } = mapErrorToResponse(err);
    res.status(status).json({ success: false, message });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const { username } = req.params;
    const loggedInUser = req.body.loggedInUser || username;
    const { productName, quantity } = req.body;

    const cart = cartService.updateCartService(username, loggedInUser, productName, quantity);
    res.status(200).json({
      success: true,
      message: `Quantity of ${productName} updated`,
      cart,
    });
  } catch (err) {
    console.error("updateCart error:", err.message);
    const { status, message } = mapErrorToResponse(err);
    res.status(status).json({ success: false, message });
  }
};
