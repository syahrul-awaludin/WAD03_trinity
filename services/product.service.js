const productRepository = require('../repositories/product.repository');

class ProductService {
  async createProduct(productData) {
    return await productRepository.createProduct(productData);
  }

  async getAllProducts() {
    return await productRepository.getAllProducts();
  }

  async getProductByName(product_name) {
    const product = await productRepository.getProductByName(product_name);
    if (!product) {
      const error = new Error("Product not found.");
      error.status = 404;
      throw error;
    }
    return product;
  }

  async updateProduct(product_name, updatedFields) {
    const existingProduct = await productRepository.getProductByName(product_name);
    if (!existingProduct) {
      const error = new Error("Product not found.");
      error.status = 404;
      throw error;
    }
    return await productRepository.updateProduct(product_name, updatedFields);
  }

  async deleteProduct(product_name) {
    const existingProduct = await productRepository.getProductByName(product_name);
    if (!existingProduct) {
      const error = new Error("Product not found.");
      error.status = 404;
      throw error;
    }
    return await productRepository.deleteProduct(product_name);
  }
}

module.exports = new ProductService();