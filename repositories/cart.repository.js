const fs = require("fs");
const path = require("path");

const cartsFile = path.join(__dirname, "../data/cart.json");
const usersFile = path.join(__dirname, "../data/user.json");
const productsFile = path.join(__dirname, "../data/productsData.json");

// --- Utility ---
function loadData(file) {
  if (!fs.existsSync(file)) return [];
  const content = fs.readFileSync(file, "utf-8");
  return content.trim() ? JSON.parse(content) : [];
}

function saveData(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// --- User Repository ---
exports.findUserByUsername = (username) => {
  const users = loadData(usersFile);
  return users.find((u) => u.username === username);
};

// --- Product Repository ---
exports.findProductByName = (productName) => {
  const products = loadData(productsFile);
  return products.find(
    (p) => p.productName.toLowerCase() === productName.toLowerCase()
  );
};

// --- Cart Repository ---
exports.getAllCarts = () => loadData(cartsFile);

exports.findCartByUsername = (username) => {
  const carts = loadData(cartsFile);
  return carts.find((c) => c.username === username);
};

exports.saveCarts = (carts) => saveData(cartsFile, carts);

exports.createEmptyCart = (username) => {
  const carts = loadData(cartsFile);
  const newCart = { username, items: [] };
  carts.push(newCart);
  saveData(cartsFile, carts);
  return newCart;
};
