const cartController = require("./cart.controller");
const cartService = require("../services/cart.service");

jest.mock("../services/cart.service");

describe("CartController", () => {
  let req, res;

  beforeEach(() => {
    req = { params: { username: "alice" }, query: {}, body: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    jest.clearAllMocks();
  });

  test("getCart returns 200 and cart data", async () => {
    const cart = { username: "alice", items: [{ productName: "Pedigree", quantity: 2 }] };
    cartService.getCartService.mockResolvedValue(cart);

    await cartController.getCart(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, cart });
  });

  test("addToCart returns 200 on success", async () => {
    req.body = { productName: "Pedigree", quantity: 1 };
    const cart = { username: "alice", items: [{ productName: "Pedigree", quantity: 1 }] };
    cartService.addToCartService.mockResolvedValue(cart);

    await cartController.addToCart(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Product added to cart",
      cart,
    });
  });

  test("removeFromCart returns 200 when successful", async () => {
    req.body = { productName: "Pedigree" };
    const cart = { username: "alice", items: [] };
    cartService.removeFromCartService.mockResolvedValue(cart);

    await cartController.removeFromCart(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Product removed from cart",
      cart,
    });
  });

  test("updateCartQuantity returns 200 when successful", async () => {
    req.body = { productName: "Pedigree", quantity: 3 };
    const cart = { username: "alice", items: [{ productName: "Pedigree", quantity: 3 }] };
    cartService.updateCartQuantityService.mockResolvedValue(cart);

    await cartController.updateCartQuantity(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Cart updated successfully",
      cart,
    });
  });

  test("handles error thrown by service", async () => {
    const err = new Error("CART_NOT_FOUND");
    cartService.getCartService.mockRejectedValue(err);
    await cartController.getCart(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});
