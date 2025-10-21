// services/cart.service.test.js
const cartService = require('./cart.service');
const userRepo = require('../repositories/user.repository');
const productRepo = require('../repositories/product.repository');
const cartRepo = require('../repositories/cart.repository');
const { NotFoundError, BadRequestError } = require('../utils/errors'); 

// Mock semua repository
jest.mock('../repositories/user.repository', () => ({
  // UBAH: Sesuaikan nama fungsi
  findByUsername: jest.fn(), 
}));
jest.mock('../repositories/product.repository', () => ({
  // UBAH: Sesuaikan nama fungsi
  getProductByName: jest.fn(),
}));
jest.mock('../repositories/cart.repository', () => ({
  findCartByUserId: jest.fn(),
  createCart: jest.fn(),
  addCartItem: jest.fn(),
  updateItemQuantity: jest.fn(),
  // UBAH: Sesuaikan dengan fungsi repo yang baru
  findCartItemByProductId: jest.fn(), 
  removeCartItemByProductId: jest.fn(),
}));

// --- Data Mock Konsisten ---
// (Gunakan data yang sama dari tes repository)
const MOCK_USER_ALICE_ID = "a11ce-a11ce-a11ce-a11ce-a11ce";
const MOCK_USER_ALICE = { 
  id: MOCK_USER_ALICE_ID, 
  username: 'alice', 
  name: 'Alice' 
};

const MOCK_PRODUCT_PEDIGREE = {
  id: 1,
  productName: "Pedigree",
  price: 3000000,
};

const MOCK_CART_ALICE = { 
  id: 1, 
  buyerId: MOCK_USER_ALICE_ID, 
  items: [] 
};

const MOCK_ITEM_PEDIGREE = { 
  id: 10, 
  cartId: MOCK_CART_ALICE.id, 
  productId: MOCK_PRODUCT_PEDIGREE.id, 
  quantity: 2 
};
// ----------------------------

// UBAH: Gunakan afterEach agar konsisten dengan product.service.test.js
afterEach(() => {
  jest.clearAllMocks();
});

// UBAH: Kelompokkan semua tes dalam satu describe
describe('CartService', () => {

  describe('getCart', () => {
    it('should return an existing cart', async () => {
      userRepo.findByUsername.mockResolvedValue(MOCK_USER_ALICE);
      cartRepo.findCartByUserId.mockResolvedValue(MOCK_CART_ALICE);

      const cart = await cartService.getCart('alice');
      
      expect(cart).toEqual(MOCK_CART_ALICE);
      expect(cartRepo.createCart).not.toHaveBeenCalled();
    });

    it('should create and return a new cart if one does not exist', async () => {
      userRepo.findByUsername.mockResolvedValue(MOCK_USER_ALICE);
      cartRepo.findCartByUserId.mockResolvedValue(null); // <-- Tidak ditemukan
      cartRepo.createCart.mockResolvedValue(MOCK_CART_ALICE); // <-- Dibuat

      const cart = await cartService.getCart('alice');

      expect(cartRepo.findCartByUserId).toHaveBeenCalledWith(MOCK_USER_ALICE_ID);
      expect(cartRepo.createCart).toHaveBeenCalledWith(MOCK_USER_ALICE_ID);
      expect(cart).toEqual(MOCK_CART_ALICE);
    });

    it('should throw NotFoundError if user not found', async () => {
      userRepo.findByUsername.mockResolvedValue(null);
      await expect(cartService.getCart('nonexistent'))
        .rejects.toThrow(NotFoundError);
    });
  });

  describe('addToCart', () => {
    
    beforeEach(() => {
      // Setup default mock untuk user, product, dan cart
      userRepo.findByUsername.mockResolvedValue(MOCK_USER_ALICE);
      productRepo.getProductByName.mockResolvedValue(MOCK_PRODUCT_PEDIGREE);
      
      // Mock helper getOrCreateCart
      // Asumsikan cart sudah ada
      cartRepo.findCartByUserId.mockResolvedValue(MOCK_CART_ALICE);
      
      // Mock 'findCartByUserId' terakhir yang dipanggil untuk mengembalikan hasil
      cartRepo.findCartByUserId.mockResolvedValueOnce(MOCK_CART_ALICE);
    });

    it('should add a new item to cart', async () => {
      // UBAH: Service sekarang memanggil findCartItemByProductId
      cartRepo.findCartItemByProductId.mockResolvedValue(null); // <-- Item belum ada
      
      // Mock 'findCartByUserId' di *akhir* service
      const updatedCart = { ...MOCK_CART_ALICE, items: [MOCK_ITEM_PEDIGREE] };
      cartRepo.findCartByUserId.mockResolvedValue(updatedCart); 

      const cart = await cartService.addToCart('alice', 'Pedigree', 2);

      expect(cartRepo.findCartItemByProductId).toHaveBeenCalledWith(MOCK_CART_ALICE.id, MOCK_PRODUCT_PEDIGREE.id);
      expect(cartRepo.addCartItem).toHaveBeenCalledWith(MOCK_CART_ALICE.id, MOCK_PRODUCT_PEDIGREE.id, 2);
      expect(cartRepo.updateItemQuantity).not.toHaveBeenCalled();
      expect(cart.items).toHaveLength(1);
    });

    it('should update quantity if item already exists', async () => {
      // UBAH: Service sekarang memanggil findCartItemByProductId
      cartRepo.findCartItemByProductId.mockResolvedValue(MOCK_ITEM_PEDIGREE); // <-- Item SUDAH ada

      const updatedCart = { ...MOCK_CART_ALICE, items: [{ ...MOCK_ITEM_PEDIGREE, quantity: 3 }] };
      cartRepo.findCartByUserId.mockResolvedValue(updatedCart);

      const cart = await cartService.addToCart('alice', 'Pedigree', 1); // Tambah 1

      expect(cartRepo.findCartItemByProductId).toHaveBeenCalledWith(MOCK_CART_ALICE.id, MOCK_PRODUCT_PEDIGREE.id);
      expect(cartRepo.updateItemQuantity).toHaveBeenCalledWith(MOCK_ITEM_PEDIGREE.id, 3); // 2 (existing) + 1 (new)
      expect(cartRepo.addCartItem).not.toHaveBeenCalled();
      expect(cart.items[0].quantity).toBe(3);
    });

    it('should throw NotFoundError if product not found', async () => {
      productRepo.getProductByName.mockResolvedValue(null);
      await expect(cartService.addToCart('alice', 'ProdukAsal', 1))
        .rejects.toThrow(NotFoundError);
    });
    
    it('should throw BadRequestError if quantity is zero or less', async () => {
      await expect(cartService.addToCart('alice', 'Pedigree', 0))
        .rejects.toThrow(BadRequestError);
      await expect(cartService.addToCart('alice', 'Pedigree', -1))
        .rejects.toThrow(BadRequestError);
    });
  });
  
  // TAMBAHAN: Tes untuk removeFromCart
  describe('removeFromCart', () => {
    
    beforeEach(() => {
      userRepo.findByUsername.mockResolvedValue(MOCK_USER_ALICE);
      // Asumsikan cart ada dan berisi item
      cartRepo.findCartByUserId.mockResolvedValue({
        ...MOCK_CART_ALICE,
        items: [MOCK_ITEM_PEDIGREE]
      });
    });

    it('should remove an item successfully', async () => {
      // Item ditemukan
      cartRepo.findCartItemByProductId.mockResolvedValue(MOCK_ITEM_PEDIGREE);
      // Mock cartRepo.remove...
      cartRepo.removeCartItemByProductId.mockResolvedValue({ count: 1 });
      
      // Mock 'findCartByUserId' di *akhir* service
      cartRepo.findCartByUserId.mockResolvedValue(MOCK_CART_ALICE); // Cart kosong

      const cart = await cartService.removeFromCart('alice', MOCK_PRODUCT_PEDIGREE.id);

      expect(cartRepo.findCartItemByProductId).toHaveBeenCalledWith(MOCK_CART_ALICE.id, MOCK_PRODUCT_PEDIGREE.id);
      expect(cartRepo.removeCartItemByProductId).toHaveBeenCalledWith(MOCK_CART_ALICE.id, MOCK_PRODUCT_PEDIGREE.id);
      expect(cart.items).toHaveLength(0);
    });

    it('should throw NotFoundError if item is not in cart', async () => {
      // Item TIDAK ditemukan
      cartRepo.findCartItemByProductId.mockResolvedValue(null);

      await expect(cartService.removeFromCart('alice', 999)) // 999 = ID produk palsu
        .rejects.toThrow(NotFoundError);
      
      expect(cartRepo.removeCartItemByProductId).not.toHaveBeenCalled();
    });

    it('should throw NotFoundError if cart does not exist', async () => {
      // Cart TIDAK ditemukan
      cartRepo.findCartByUserId.mockResolvedValue(null);

      await expect(cartService.removeFromCart('alice', MOCK_PRODUCT_PEDIGREE.id))
        .rejects.toThrow(NotFoundError);
      
      expect(cartRepo.findCartItemByProductId).not.toHaveBeenCalled();
    });
  });
});