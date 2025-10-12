const cartRepo = require("../repositories/cart.repository");

// --- Authorization Logic ---
function authorize(usernameParam, loggedInUser) {
  const user = cartRepo.findUserByUsername(usernameParam);

  if (!user) return { ok: false, message: "User not found", status: 404 };
  if (user.role !== "buyer")
    return { ok: false, message: "Only buyers can access cart", status: 403 };
  if (loggedInUser !== usernameParam)
    return {
      ok: false,
      message: "You cannot access someone else's cart",
      status: 403,
    };

  return { ok: true, user };
}

// --- Service: Get Cart ---
exports.getCartService = (username, loggedInUser) => {
  const auth = authorize(username, loggedInUser);
  if (!auth.ok) return auth;

  let cart = cartRepo.findCartByUsername(username);
  if (!cart) {
    cart = cartRepo.createEmptyCart(username);
  }

  return { ok: true, cart };
};

// --- Service: Add to Cart ---
exports.addToCartService = (username, loggedInUser, productName, quantity) => {
  const auth = authorize(username, loggedInUser);
  if (!auth.ok) return auth;

  if (!productName || quantity === undefined)
    return { ok: false, status: 400, message: "productName and quantity are required" };

  const qty = parseInt(quantity, 10);
  if (isNaN(qty) || qty <= 0)
    return { ok: false, status: 400, message: "quantity must be a positive integer" };

  const product = cartRepo.findProductByName(productName);
  if (!product)
    return { ok: false, status: 404, message: `Product not found: ${productName}` };

  const carts = cartRepo.getAllCarts();
  let cart = carts.find((c) => c.username === username);

  if (!cart) {
    cart = { username, items: [] };
    carts.push(cart);
  }

  if (!Array.isArray(cart.items)) cart.items = [];

  const existingItem = cart.items.find(
    (i) => i.productName.toLowerCase() === productName.toLowerCase()
  );

  if (existingItem) {
    existingItem.quantity += qty;
  } else {
    cart.items.push({ productName: product.productName, quantity: qty });
  }

  cartRepo.saveCarts(carts);

  return { ok: true, cart };
};

// --- Service: Remove from Cart ---
exports.removeFromCartService = (username, loggedInUser, productName) => {
  const auth = authorize(username, loggedInUser);
  if (!auth.ok) return auth;

  if (!productName)
    return { ok: false, status: 400, message: "productName is required" };

  const carts = cartRepo.getAllCarts();
  const cart = carts.find((c) => c.username === username);
  if (!cart)
    return { ok: false, status: 404, message: "Cart not found" };

  cart.items = cart.items.filter(
    (i) => i.productName.toLowerCase() !== productName.toLowerCase()
  );
  cartRepo.saveCarts(carts);

  return { ok: true, cart };
};

// --- Service: Update Quantity ---
exports.updateCartService = (username, loggedInUser, productName, quantity) => {
  const auth = authorize(username, loggedInUser);
  if (!auth.ok) return auth;

  if (!productName || quantity === undefined)
    return { ok: false, status: 400, message: "productName and quantity are required" };

  const qty = parseInt(quantity, 10);
  if (isNaN(qty) || qty <= 0)
    return { ok: false, status: 400, message: "quantity must be a positive integer" };

  const carts = cartRepo.getAllCarts();
  const cart = carts.find((c) => c.username === username);
  if (!cart)
    return { ok: false, status: 404, message: "Cart not found" };

  const item = cart.items.find(
    (i) => i.productName.toLowerCase() === productName.toLowerCase()
  );

  if (!item)
    return { ok: false, status: 404, message: "Product not found in cart" };

  item.quantity = qty;
  cartRepo.saveCarts(carts);

  return { ok: true, cart };
};
