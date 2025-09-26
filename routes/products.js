const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");

router.post("/products", productController.createProduct);
router.get("/products", productController.getProducts);
router.get("/products/:product_name", productController.getProductByName);

module.exports = router;