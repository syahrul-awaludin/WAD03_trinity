// services/cart.service.js
const { NotFoundError, BadRequestError } = require('../utils/errors'); 
const userRepo = require('../repositories/user.repository');
const productRepo = require('../repositories/product.repository');
const cartRepo = require('../repositories/cart.repository');

// UBAH: Menggunakan struktur Class agar konsisten
class CartService {
  
  // Helper untuk mendapatkan atau membuat keranjang
  async getOrCreateCart(userId) {
    let cart = await cartRepo.findCartByUserId(userId);
    if (!cart) {
      // UBAH: createCart sekarang mengembalikan cart yang sudah lengkap
      // (sesuai penyesuaian repository kita sebelumnya)
      // Jadi tidak perlu findCartByUserId kedua.
      cart = await cartRepo.createCart(userId);
    }
    return cart;
  }

  async getCart(username) {
    // UBAH: Sesuaikan nama fungsi repositori
    const user = await userRepo.findByUsername(username); 
    if (!user) throw new NotFoundError('User not found');

    // Asumsi: Objek user dari repo memiliki properti 'id'
    // (Penting: pastikan user.repository.js Anda mengembalikan 'id' user)
    const cart = await this.getOrCreateCart(user.id);
    return cart;
  }

  async addToCart(username, productName, quantity) {
    // UBAH: Sesuaikan nama fungsi repositori
    const user = await userRepo.findByUsername(username);
    if (!user) throw new NotFoundError('User not found');

    // UBAH: Sesuaikan nama fungsi repositori
    const product = await productRepo.getProductByName(productName);
    if (!product) throw new NotFoundError('Product not found');

    if (quantity <= 0) throw new BadRequestError('Invalid quantity');

    const cart = await this.getOrCreateCart(user.id);

    // UBAH: Gunakan fungsi repo yang lebih efisien, jangan pakai cart.items.find()
    const existingItem = await cartRepo.findCartItemByProductId(cart.id, product.id);

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      await cartRepo.updateItemQuantity(existingItem.id, newQuantity);
    } else {
      await cartRepo.addCartItem(cart.id, product.id, quantity);
    }

    // Selalu ambil data terbaru dari DB setelah modifikasi
    return await cartRepo.findCartByUserId(user.id);
  }

  async removeFromCart(username, productId) {
    // UBAH: Sesuaikan nama fungsi repositori
    const user = await userRepo.findByUsername(username);
    if (!user) throw new NotFoundError('User not found');

    const cart = await cartRepo.findCartByUserId(user.id);
    if (!cart) {
      // Tidak perlu error, jika cart tidak ada, berarti item juga tidak ada
      throw new NotFoundError('Item not found in cart');
    }

    // UBAH: Gunakan logika repository yang sudah disesuaikan
    // Cek dulu apakah itemnya memang ada
    const itemToRemove = await cartRepo.findCartItemByProductId(cart.id, productId);
    if (!itemToRemove) throw new NotFoundError('Item not found in cart');

    // Panggil fungsi repo yang benar
    await cartRepo.removeCartItemByProductId(cart.id, productId);

    return await cartRepo.findCartByUserId(user.id);
  }
}


module.exports = new CartService();