// controllers/cart.controller.js
const cartService = require('../services/cart.service');

// UBAH: Kita hanya butuh BadRequestError di sini
const { BadRequestError } = require('../utils/errors');

// UBAH: Hapus helper mapErrorToResponse, karena middleware pusat akan menanganinya
// function mapErrorToResponse(err) { ... }

const cartController = {
  // UBAH: Tambahkan 'next' sebagai parameter
  getCart: async (req, res, next) => {
    try {
      const { username } = req.params;
      const cart = await cartService.getCart(username);
      res.status(200).json({ success: true, cart });
    } catch (err) {
      // UBAH: Teruskan error ke middleware
      next(err);
    }
  },

  // UBAH: Tambahkan 'next' sebagai parameter
  addToCart: async (req, res, next) => {
    try {
      const { username } = req.params;
      const { productName, quantity } = req.body;

      if (!productName || !quantity) {
        throw new BadRequestError('productName and quantity are required');
      }

      const cart = await cartService.addToCart(username, productName, quantity);
      res.status(201).json({ success: true, message: 'Item added to cart', cart });
    } catch (err) {
      // UBAH: Teruskan error ke middleware
      next(err);
    }
  },

  // UBAH: Tambahkan 'next' sebagai parameter
  removeFromCart: async (req, res, next) => {
    try {
      const { username } = req.params;
      const { productId } = req.body; 

      if (!productId) {
         throw new BadRequestError('productId is required');
      }

      const cart = await cartService.removeFromCart(username, parseInt(productId, 10));
      res.status(200).json({ success: true, message: 'Item removed from cart', cart });
    } catch (err) {
      // UBAH: Teruskan error ke middleware
      next(err);
    }
  },
};

module.exports = cartController;