const cartRepository = require("../../repositories/cart.repository");
const CartService = require("../../services/cart.service");

jest.mock("../../repositories/cart.repository");

describe("CartService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getCartService", () => {
    it("returns existing cart if found", async () => {
      const userId = "user-123";
      const existingCart = { id: "cart-1", userId, items: [] };

      cartRepository.getCartByUserId.mockResolvedValue(existingCart);

      const result = await CartService.getCartService(userId);

      expect(cartRepository.getCartByUserId).toHaveBeenCalledWith(userId);
      expect(cartRepository.createCart).not.toHaveBeenCalled();
      expect(result).toEqual(existingCart);
    });

    it("creates new cart if not found", async () => {
      const userId = "user-456";
      const newCart = { id: "cart-2", userId, items: [] };

      cartRepository.getCartByUserId.mockResolvedValue(null);
      cartRepository.createCart.mockResolvedValue(newCart);

      const result = await CartService.getCartService(userId);

      expect(cartRepository.getCartByUserId).toHaveBeenCalledWith(userId);
      expect(cartRepository.createCart).toHaveBeenCalledWith(userId);
      expect(result).toEqual(newCart);
    });
  });

  describe("addItemToCart", () => {
    it("adds new product if not in cart", async () => {
      const userId = "user-789";
      const productId = 10;
      const quantity = 2;
      const cart = { id: "cart-3", userId };

      const existingCartItem = null;
      const newItem = { id: "item-1", cartId: cart.id, productId, quantity };

      cartRepository.getCartByUserId.mockResolvedValue(cart);
      cartRepository.getCartItem.mockResolvedValue(existingCartItem);
      cartRepository.createCartItem.mockResolvedValue(newItem);

      const result = await CartService.addItemToCart(userId, productId, quantity);

      expect(cartRepository.getCartByUserId).toHaveBeenCalledWith(userId);
      expect(cartRepository.getCartItem).toHaveBeenCalledWith(cart.id, productId);
      expect(cartRepository.createCartItem).toHaveBeenCalledWith(cart.id, productId, quantity);
      expect(result).toEqual(newItem);
    });

    it("updates quantity if product already in cart", async () => {
      const userId = "user-999";
      const productId = 20;
      const quantity = 3;
      const cart = { id: "cart-4", userId };

      const existingCartItem = { id: "item-2", cartId: cart.id, productId, quantity: 1 };
      const updatedCartItem = { ...existingCartItem, quantity: 4 };

      cartRepository.getCartByUserId.mockResolvedValue(cart);
      cartRepository.getCartItem.mockResolvedValue(existingCartItem);
      cartRepository.updateCartItemQuantity.mockResolvedValue(updatedCartItem);

      const result = await CartService.addItemToCart(userId, productId, quantity);

      expect(cartRepository.getCartByUserId).toHaveBeenCalledWith(userId);
      expect(cartRepository.getCartItem).toHaveBeenCalledWith(cart.id, productId);
      expect(cartRepository.updateCartItemQuantity).toHaveBeenCalledWith(existingCartItem.id, 4);
      expect(result).toEqual(updatedCartItem);
    });
  });
});
