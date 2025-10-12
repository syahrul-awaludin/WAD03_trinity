const productService = require('../services/product.service');

// POST /products 
exports.createProduct = (req, res) => {
  if (!req.body) {
    return res.status(400).json({ success: false, message: "Request body is missing." });
  }

  try {
    const product = productService.createProduct(req.body);
    res.status(201).json({ success: true, product });
  } catch (error) {
    const status = error.status || 500;
    const message = error.message || "Internal server error.";
    res.status(status).json({ success: false, message });
  }
};

// GET /products 
exports.getProducts = (req, res) => {
  try {
    const products = productService.getAllProducts();
    res.json({ success: true, products });
  } catch (error) {
    const status = error.status || 500;
    const message = error.message || "Internal server error.";
    res.status(status).json({ success: false, message });
  }
};

// GET /products/:product_name
exports.getProductByName = (req, res) => {
  const { product_name } = req.params;

  try {
    const product = productService.getProductByName(product_name);
    res.json({ success: true, product });
  } catch (error) {
    const status = error.status || 500;
    const message = error.message || "Internal server error.";
    res.status(status).json({ success: false, message });
  }
};

// PATCH /products/:product_name 
exports.updateProduct = (req, res) => {

  if (!req.body) {
    return res.status(400).json({ success: false, message: "Request body is missing." });
  }

  const { product_name } = req.params;

  try {
    const product = productService.updateProduct(product_name, req.body);
    res.json({ success: true, product });
  } catch (error) {
    const status = error.status || 500;
    const message = error.message || "Internal server error.";
    res.status(status).json({ success: false, message });
  }
};

// DELETE /products/:product_name 
exports.deleteProduct = (req, res) => {
  const { product_name } = req.params;

  try {
    productService.deleteProduct(product_name);
    res.json({ success: true, message: "Product deleted successfully!" });
  } catch (error) {
    const status = error.status || 500;
    const message = error.message || "Internal server error.";
    res.status(status).json({ success: false, message });
  }
};