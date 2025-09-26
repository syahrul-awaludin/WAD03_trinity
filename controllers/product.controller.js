const products = require('../data/productsData.json');
const users = require('../data/user.json');

exports.createProduct = (req, res) => {
  const { productName, productCategory, price, owner } = req.body;

  // cek kalau nama produk sudah ada dan harus unik
  if (products.find(p => p.productName === productName)) {
    return res.status(400).json({ success: false, message: "Product name must be unique!" });
  }

  // cek user berdasarkan owner
  const user = users.find(u => u.username === owner);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found!" });
  }

  // cek role user
  if (user.role !== "seller") {
    return res.status(403).json({ success: false, message: "Only sellers can add products!" });
  }

  // Tambahkan produk
  const newProduct = { productName, productCategory, price, owner };
  products.push(newProduct);
  return res.status(201).json({ success: true, message: "Product added successfully!", product: newProduct });
};

exports.getProducts = (res) => {
  res.json(products);
};

exports.getProductByName = (req, res) => {
  const product = products.find(p => p.productName === req.params.product_name);
  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found :(" });
  }
  res.json(product);
};
