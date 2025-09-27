const fs = require("fs");
const path = require("path");

const cartsFile = path.join(__dirname, "../data/cart.json");
const usersFile = path.join(__dirname, "../data/user.json");
const productsFile = path.join(__dirname, "../data/productsData.json");

// --- Utility functions ---
function loadData(file) {
  try {
    if (!fs.existsSync(file)) return [];
    const content = fs.readFileSync(file, "utf-8");
    if (!content.trim()) return [];
    return JSON.parse(content);
  } catch (err) {
    console.error("loadData error:", err.message);
    return [];
  }
}

function saveData(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// --- Helper: authorize langsung di path ---
function authorize(usernameParam, loggedInUser) {
  const users = loadData(usersFile);
  const user = users.find((u) => u.username === usernameParam);

  if (!user) {
    return { ok: false, status: 404, message: "User not found" };
  }

  if (user.role !== "buyer") {
    return { ok: false, status: 403, message: "Only buyers can access cart" };
  }

  if (loggedInUser !== usernameParam) {
    return {
      ok: false,
      status: 403,
      message: "You cannot access someone else's cart",
    };
  }

  return { ok: true, user };
}

// --- GET /carts/:username ---
exports.getCart = (req, res) => {
  try {
    const { username } = req.params;
    const loggedInUser = req.query.loggedInUser || username;

    const auth = authorize(username, loggedInUser);
    if (!auth.ok) {
      return res.status(auth.status).json({ success: false, message: auth.message });
    }

    let carts = loadData(cartsFile);
    let cart = carts.find((c) => c.username === username);

    if (!cart) {
      cart = { username, items: [] };
      carts.push(cart);
      saveData(cartsFile, carts);
    }

    return res.json({ success: true, cart });
  } catch (err) {
    console.error("getCart error:", err);
    return res.status(500).json({ success: false, message: "Something went wrong!" });
  }
};

// --- POST /carts/:username/add ---
exports.addToCart = (req, res) => {
  try {
    const { username } = req.params;
    const loggedInUser = req.query.loggedInUser || username; // FIX
    const { productName, quantity } = req.body;

    const auth = authorize(username, loggedInUser);
    if (!auth.ok) return res.status(auth.status).json({ message: auth.message });

    if (!productName || quantity === undefined) {
      return res.status(400).json({ message: "productName and quantity are required" });
    }

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      return res.status(400).json({ message: "quantity must be a positive integer" });
    }

    const products = loadData(productsFile);
    const product = products.find((p) => p.productName.toLowerCase() === productName.toLowerCase());
    if (!product) {
      return res.status(404).json({ message: `Product not found: ${productName}` });
    }

    let carts = loadData(cartsFile);
    let cart = carts.find((c) => c.username === username);

    if (!cart) {
      cart = { username, items: [] };
      carts.push(cart);
    }

    if (!Array.isArray(cart.items)) {
      cart.items = [];
    }

    const existingItem = cart.items.find((i) => i.productName.toLowerCase() === productName.toLowerCase());
    if (existingItem) {
      existingItem.quantity += qty;
    } else {
      cart.items.push({ productName: product.productName, quantity: qty });
    }

    saveData(cartsFile, carts);
    return res.json({ message: "Product added to cart", cart });
  } catch (err) {
    console.error("addToCart error:", err);
    return res.status(500).json({ success: false, message: "Something went wrong!" });
  }
};

// --- POST /carts/:username/remove ---
exports.removeFromCart = (req, res) => {
  try {
    const { username } = req.params;
    const loggedInUser = req.query.loggedInUser || username; // FIX
    const { productName } = req.body;

    const auth = authorize(username, loggedInUser);
    if (!auth.ok) return res.status(auth.status).json({ message: auth.message });

    if (!productName) {
      return res.status(400).json({ message: "productName is required" });
    }

    let carts = loadData(cartsFile);
    let cart = carts.find((c) => c.username === username);

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter((i) => i.productName.toLowerCase() !== productName.toLowerCase());

    if (!Array.isArray(cart.items)) {
      cart.items = [];
    }

    saveData(cartsFile, carts);

    return res.json({ success: true, message: `Product ${productName} removed from cart`, cart });
  } catch (err) {
    console.error("removeFromCart error:", err);
    return res.status(500).json({ success: false, message: "Something went wrong!" });
  }
};

// --- PUT /carts/:username (update quantity) ---
exports.updateCart = (req, res) => {
  try {
    const { username } = req.params;
    const loggedInUser = req.body.loggedInUser || username;
    const { productName, quantity } = req.body;

    const auth = authorize(username, loggedInUser);
    if (!auth.ok) {
      return res.status(auth.status).json({ success: false, message: auth.message });
    }

    if (!productName || quantity === undefined) {
      return res.status(400).json({ success: false, message: "productName and quantity are required" });
    }

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      return res.status(400).json({ success: false, message: "quantity must be a positive integer" });
    }

    let carts = loadData(cartsFile);
    let cart = carts.find((c) => c.username === username);

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    const item = cart.items.find(
      (i) => i.productName.toLowerCase() === productName.toLowerCase()
    );

    if (!item) {
      return res.status(404).json({ success: false, message: "Product not found in cart" });
    }

    // update quantity
    item.quantity = qty;

    saveData(cartsFile, carts);

    return res.json({
      success: true,
      message: `Quantity of ${productName} updated to ${qty}`,
      cart,
    });
  } catch (err) {
    console.error("updateCart error:", err);
    return res.status(500).json({ success: false, message: "Something went wrong!" });
  }
};
