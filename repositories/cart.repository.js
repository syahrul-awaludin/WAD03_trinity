// repositories/cart.repository.js
const prisma = require('./prisma');

class CartRepository {
  /**
   * Mencari keranjang belanja berdasarkan ID pengguna (UUID).
   * Ini adalah fungsi utama untuk mendapatkan keranjang.
   */
  async findCartByUserId(userId) {
    return await prisma.cart.findFirst({
      where: { buyerId: userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  /**
   * Membuat keranjang belanja baru yang kosong untuk pengguna.
   */
  async createCart(userId) {
    return await prisma.cart.create({
      data: {
        buyerId: userId,
      },
      include: {
        items: true,
      },
    });
  }


  async findCartItemByProductId(cartId, productId) {
    return await prisma.cartItem.findFirst({
      where: {
        cartId: cartId,
        productId: productId,
      },
    });
  }


  async addCartItem(cartId, productId, quantity) {
    return await prisma.cartItem.create({
      data: {
        cartId: cartId,
        productId: productId,
        quantity: quantity,
      },
    });
  }


  async updateItemQuantity(cartItemId, newQuantity) {
    return await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity: newQuantity },
    });
  }

  async removeCartItemByProductId(cartId, productId) {
    // Kita gunakan deleteMany karena ia bisa menargetkan berdasarkan kondisi
    return await prisma.cartItem.deleteMany({
      where: {
        cartId: cartId,
        productId: productId,
      },
    });
  }
}

module.exports = new CartRepository();