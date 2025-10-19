const prisma = require("./prisma");

class ProductRepository {
  async createProduct(productData) {
    return await prisma.product.create({
      data: productData,
    });
  }

  async getAllProducts() {
    return await prisma.product.findMany();
  }

  async getProductByName(product_name) {
    return await prisma.product.findFirst({
      where: { productName: product_name },
    });
  }

  async updateProduct(product_name, updatedFields) {
    const product = await prisma.product.findFirst({ where: { productName: product_name } });
    if (!product) return null;
    return await prisma.product.update({
      where: { id: product.id },
      data: updatedFields,
    });
  }

  async deleteProduct(product_name) {
    const product = await prisma.product.findFirst({ where: { productName: product_name } });
    if (!product) return null;
    return await prisma.product.delete({
      where: { id: product.id },
    });
  }
}

module.exports = new ProductRepository();