const productService = require('../services/product.service');
const { BadRequestError } = require("../utils/errors");
const { UnprocessableEntityError } = require("../utils/errors");

const ProductValidator = {
  validateCreateProduct(data) {
    const { productName, productCategory, price, ownerId } = data;
    const errors = [];

    if (!productName || typeof productName !== "string" || productName.trim() === "") {
      errors.push("Product name is required.");
    }
    if (!productCategory || typeof productCategory !== "string" || productCategory.trim() === "") {
      errors.push("Product category is required.");
    }
    if (price === undefined || typeof price !== "number" || price < 0) {
      errors.push("Price must be a non-negative number.");
    }
    if (!ownerId || typeof ownerId !== "string" || ownerId.trim() === "") {
      errors.push("Owner ID is required.");
    }

    if (errors.length > 0) {
      throw new UnprocessableEntityError(errors);
    }
  },

  validateUpdateProduct(data) {
    const { productName, productCategory, price } = data;
    const errors = [];

    if (productName !== undefined && (typeof productName !== "string" || productName.trim() === "")) {
      errors.push("Product name is invalid.");
    }
    if (productCategory !== undefined && (typeof productCategory !== "string" || productCategory.trim() === "")) {
      errors.push("Product category is invalid.");
    }
    if (price !== undefined && (typeof price !== "number" || price < 0)) {
      errors.push("Price must be a non-negative number.");
    }

    if (errors.length > 0) {
      throw new UnprocessableEntityError(errors);
    }
  },
}
// POST /products
exports.createProduct = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      throw new BadRequestError("Request body is missing.");
    }
    ProductValidator.validateCreateProduct(req.body);
    const product = await productService.createProduct(req.body);
    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};
// GET /products 
exports.getProducts = async (req, res, next) => {
  try {
    const products = await productService.getAllProducts();
    res.json({ success: true, products });
  } catch (error) {
    next(error);
  }
};
// GET /products/:product_name 
exports.getProductByName = async (req, res, next) => {
  try {
    const { product_name } = req.params;
    
    if (!product_name || product_name.trim() === "") {
      throw new BadRequestError("Product name parameter is required.");
    }
    const product = await productService.getProductByName(product_name);
    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};
// PATCH /products/:product_name 
exports.updateProduct = async (req, res, next) => {
  try {
    const { product_name } = req.params;
    if (!product_name || product_name.trim() === "") {
      throw new BadRequestError("Product name parameter is required.");
    }
    if (!req.body || Object.keys(req.body).length === 0) {
      throw new BadRequestError("Request body is missing.");
    }
    ProductValidator.validateUpdateProduct(req.body);
    const updatedProduct = await productService.updateProduct(product_name, req.body);
    res.json({ success: true, product: updatedProduct });
  } catch (error) {
    next(error);
  }
};
// DELETE /products/:product_name 
exports.deleteProduct = async (req, res, next) => {
  try {
    const { product_name } = req.params;
    if (!product_name || product_name.trim() === "") {
      throw new BadRequestError("Product name parameter is required.");
    }
    await productService.deleteProduct(product_name);
    res.json({ success: true, message: "Product deleted successfully." });
  } catch (error) {
    next(error);
  }
};