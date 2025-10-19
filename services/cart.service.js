const cartRepo = require("../repositories/cart.repository");
const cartService = require("../services/cart.service");

jest.mock("../repositories/cart.repository");

describe("CartService", () => {
  const username = "alice";
  const loggedInUser = "alice";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- getCartService ---
  describe("getCartService", () => {
    it("should return existing cart if found", () => {
      const mockUser = { username, role: "buyer" };
      const mockCart = { username, items: [] };

      cartRepo.findUserByUsername.mockReturnValue(mockUser);
      cartRepo.findCartByUsername.mockReturnValue(mockCart);

      const result = cartService.getCartService(username, loggedInUser);

      expect(cartRepo.findUserByUsername).toHaveBeenCalledWith(username);
      expect(cartRepo.findCartByUsername).toHaveBeenCalledWith(username);
      expect(cartRepo.createEmptyCart).not.toHaveBeenCalled();
      expect(result).toEqual(mockCart);
    });

    it("should create empty cart if not found", () => {
      const mockUser = { username, role: "buyer" };
      const mockNewCart = { username, items: [] };

      cartRepo.findUserByUsername.mockReturnValue(mockUser);
      cartRepo.findCartByUsername.mockReturnValue(null);
      cartRepo.createEmptyCart.mockReturnValue(mockNewCart);

      const result = cartService.getCartService(username, loggedInUser);

      expect(cartRepo.findUserByUsername).toHaveBeenCalledWith(username);
      expect(cartRepo.createEmptyCart).toHaveBeenCalledWith(username);
      expect(result).toEqual(mockNewCart);
    });
  });

  // --- addToCartService ---
  describe("addToCartService", () => {
    it("should add a new product to cart if not exists", () => {
      const mockUser = { username, role: "buyer" };
      const productName = "Laptop";
      const quantity = 2;
      const mockProduct = { productName };
      const mockCarts = [{ username, items: [] }];

      cartRepo.findUserByUsername.mockReturnValue(mockUser);
      cartRepo.findProductByName.mockReturnValue(mockProduct);
      cartRepo.getAllCarts.mockReturnValue(mockCarts);

      const result = cartService.addToCartService(username, loggedInUser, productName, quantity);

      expect(cartRepo.getAllCarts).toHaveBeenCalled();
      expect(cartRepo.saveCarts).toHaveBeenCalled();
      expect(result.items[0]).toEqual({ productName, quantity });
    });

    it("should update quantity if product already exists in cart", () => {
      const mockUser = { username, role: "buyer" };
      const productName = "Phone";
      const quantity = 3;
      const mockProduct = { productName };
      const mockCarts = [
        { username, items: [{ productName, quantity: 1 }] },
      ];

      cartRepo.findUserByUsername.mockReturnValue(mockUser);
      cartRepo.findProductByName.mockReturnValue(mockProduct);
      cartRepo.getAllCarts.mockReturnValue(mockCarts);

      const result = cartService.addToCartService(username, loggedInUser, productName, quantity);

      expect(result.items[0].quantity).toBe(4);
      expect(cartRepo.saveCarts).toHaveBeenCalled();
    });

    it("should throw error if product not found", () => {
      const mockUser = { username, role: "buyer" };
      cartRepo.findUserByUsername.mockReturnValue(mockUser);
      cartRepo.findProductByName.mockReturnValue(null);

      expect(() =>
        cartService.addToCartService(username, loggedInUser, "Unknown", 2)
      ).toThrow("PRODUCT_NOT_FOUND");
    });
  });

  // --- removeFromCartService ---
  describe("removeFromCartService", () => {
    it("should remove product from cart", () => {
      const mockUser = { username, role: "buyer" };
      const productName = "Phone";
      const mockCarts = [
        { username, items: [{ productName, quantity: 2 }] },
      ];

      cartRepo.findUserByUsername.mockReturnValue(mockUser);
      cartRepo.getAllCarts.mockReturnValue(mockCarts);

      const result = cartService.removeFromCartService(username, loggedInUser, productName);

      expect(result.items.length).toBe(0);
      expect(cartRepo.saveCarts).toHaveBeenCalled();
    });

    it("should throw error if cart not found", () => {
      const mockUser = { username, role: "buyer" };
      cartRepo.findUserByUsername.mockReturnValue(mockUser);
      cartRepo.getAllCarts.mockReturnValue([]);

      expect(() =>
        cartService.removeFromCartService(username, loggedInUser, "Phone")
      ).toThrow("CART_NOT_FOUND");
    });
  });

  // --- updateCartService ---
  describe("updateCartService", () => {
    it("should update item quantity", () => {
      const mockUser = { username, role: "buyer" };
      const productName = "Phone";
      const mockCarts = [
        { username, items: [{ productName, quantity: 1 }] },
      ];

      cartRepo.findUserByUsername.mockReturnValue(mockUser);
      cartRepo.getAllCarts.mockReturnValue(mockCarts);

      const result = cartService.updateCartService(username, loggedInUser, productName, 5);

      expect(result.items[0].quantity).toBe(5);
      expect(cartRepo.saveCarts).toHaveBeenCalled();
    });

    it("should throw error if item not found", () => {
      const mockUser = { username, role: "buyer" };
      const mockCarts = [{ username, items: [] }];

      cartRepo.findUserByUsername.mockReturnValue(mockUser);
      cartRepo.getAllCarts.mockReturnValue(mockCarts);

      expect(() =>
        cartService.updateCartService(username, loggedInUser, "Unknown", 3)
      ).toThrow("ITEM_NOT_FOUND");
    });
  });
});
