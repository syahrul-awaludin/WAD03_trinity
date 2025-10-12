const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");

router.get("/carts/:username", cartController.getCart);
router.post("/carts/:username/add", cartController.addToCart);
router.post("/carts/:username/remove", cartController.removeFromCart);
router.put("/carts/:username", cartController.updateCart);

module.exports = router;
