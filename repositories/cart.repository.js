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

// cart.repository.js
const prisma = require("./prisma");

const cartRepository = {
  async findAll() {
    return prisma.cart.findMany({ include: { items: true } });
  },

  async findById(id) {
    return prisma.cart.findUnique({ where: { id }, include: { items: true } });
  },

  async create(data) {
    return prisma.cart.create({ data });
  },

  async addItem(cartId, productId, quantity) {
    return prisma.cartItem.create({
      data: { cartId, productId, quantity },
    });
  },

  async removeItem(itemId) {
    return prisma.cartItem.delete({ where: { id: itemId } });
  },

  async delete(id) {
    return prisma.cart.delete({ where: { id } });
  },
};

module.exports = cartRepository;
