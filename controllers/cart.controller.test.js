// controllers/cart.controller.test.js
const cartController = require('./cart.controller');
const cartService = require('../services/cart.service');

// UBAH: Impor error yang akan kita gunakan untuk mocking
const { NotFoundError, BadRequestError } = require('../utils/errors');

jest.mock('../services/cart.service', () => ({
  getCart: jest.fn(),
  addToCart: jest.fn(),
  removeFromCart: jest.fn(),
}));

describe('Cart Controller', () => {
  // UBAH: Tambahkan 'next'
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      params: { username: 'alice' },
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    // UBAH: Inisialisasi mock 'next'
    next = jest.fn();
  });

  describe('getCart', () => {
    it('should return 200 and cart data', async () => {
      const mockCart = { id: 1, items: [] };
      cartService.getCart.mockResolvedValue(mockCart);
      
      // UBAH: Tambahkan 'next'
      await cartController.getCart(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, cart: mockCart });
      expect(next).not.toHaveBeenCalled(); // Pastikan next tidak dipanggil saat sukses
    });

    // UBAH: Tes error sekarang memeriksa 'next'
    it('should call next with the error if service fails', async () => {
      const error = new NotFoundError('User not found');
      cartService.getCart.mockRejectedValue(error); 

      // UBAH: Tambahkan 'next'
      await cartController.getCart(req, res, next);

      // UBAH: Harapannya adalah 'next' dipanggil dengan error
      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('addToCart', () => {
    it('should add item and return 201', async () => {
      req.body = { productName: 'Laptop', quantity: 1 };
      const mockCart = { id: 1, items: [{ productName: 'Laptop', quantity: 1 }] };
      cartService.addToCart.mockResolvedValue(mockCart);
      
      // UBAH: Tambahkan 'next'
      await cartController.addToCart(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Item added to cart', cart: mockCart });
      expect(next).not.toHaveBeenCalled();
    });

    // TAMBAHAN: Tes validasi (agar konsisten dengan product.controller.test.js)
    it('should call next with BadRequestError if body is incomplete', async () => {
      req.body = { productName: 'Laptop' }; // Quantity hilang
      
      // UBAH: Tambahkan 'next'
      await cartController.addToCart(req, res, next);
      
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
      expect(next.mock.calls[0][0].message).toBe('productName and quantity are required');
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('removeFromCart', () => {
    it('should remove item and return 200', async () => {
      req.body = { productId: 123 }; 
      const mockCart = { id: 1, items: [] };
      cartService.removeFromCart.mockResolvedValue(mockCart);
      
      // UBAH: Tambahkan 'next'
      await cartController.removeFromCart(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Item removed from cart', cart: mockCart });
      expect(next).not.toHaveBeenCalled();
    });

    // TAMBAHAN: Tes validasi
    it('should call next with BadRequestError if productId is missing', async () => {
      req.body = {}; // productId hilang
      
      // UBAH: Tambahkan 'next'
      await cartController.removeFromCart(req, res, next);
      
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
      expect(next.mock.calls[0][0].message).toBe('productId is required');
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  // UBAH: Tes error ini sekarang sudah dicakup di dalam masing-masing describe (seperti di getCart)
  // it('should handle service errors', ...) // Hapus tes ini
});