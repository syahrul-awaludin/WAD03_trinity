const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");

// update cart
router.put("/carts/:username", cartController.updateCart);

// GET cart
router.get("/carts/:username", cartController.getCart);

// ADD product to cart
router.post("/carts/:username/add", cartController.addToCart);

// REMOVE product from cart
router.post("/carts/:username/remove", cartController.removeFromCart);

module.exports = router;
