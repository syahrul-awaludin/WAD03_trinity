const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");


router.get("/carts/:username", cartController.getCart);

router.post("/carts/:username/add", cartController.addToCart);

router.delete("/carts/:username/remove", cartController.removeFromCart);

module.exports = router;