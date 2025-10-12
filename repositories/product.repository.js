const products = require('../data/productsData.json');

class ProductRepository {
  getProducts() {
    return products;
  }

  getProductByName(product_name) {
    return products.find(p => p.productName === product_name);
  }

  createProduct(productData) {
    products.push(productData);
    return productData;
  }

  updateProduct(product_name, updatedFields) {
    const product = this.getProductByName(product_name);
    if (product) {
      Object.assign(product, updatedFields);
      return product;
    }
  }

  deleteProduct(product_name) {
    const index = products.findIndex(p => p.productName === product_name);
    if (index !== -1) {
      const deleted = products.splice(index, 1)[0];
      return deleted;
    }
    return null;
  }
}

module.exports = new ProductRepository();
