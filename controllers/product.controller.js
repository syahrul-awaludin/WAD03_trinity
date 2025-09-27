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
    console.log(user)
    return res.status(404).json({ success: false, message: "User not found!" });

  }

  // cek role user
  if (user.role !== "seller") {
    return res.status(403).json({ success: false, message: "Only sellers can add products!" });
  }

  //Validasi input untuk product harus diisi semua
  if (!productName || !productCategory || price == null || !owner) {
    return res.status(400).json({ success: false, message: "All fields are required!" });
  }

  // Tambahkan produk
  const newProduct = { productName, productCategory, price, owner };
  products.push(newProduct);
  console.log(users)
  return res.status(201).json({ success: true, message: "Product added successfully!", product: newProduct });
};


exports.getProducts = (req, res) => {
  res.json(products);
};


exports.getProductByName = (req, res) => {
  const product = products.find(p => p.productName === req.params.product_name);
  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found :(" });
  }
  res.json(product);
};

// Update product by product_name
exports.updateProduct = (req, res) => {
  const { product_name } = req.params;
  const { productCategory, price, owner } = req.body;

  const product = products.find(p => p.productName === product_name);
  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found!" });
  }

  // Validasi input untuk product harus diisi semua
  if (!productCategory || price == null || !owner) {
    return res.status(400).json({ success: false, message: "All fields are required!" });
  }

  // Cek user berdasarkan owner
  const user = users.find(u => u.username === owner);
  if (!user) {

    return res.status(404).json({ success: false, message: "User not found!" });
  }

  // Cek role user
  if (user.role !== "seller") {
    return res.status(403).json({ success: false, message: "Only sellers can update products!" });
  }

  // Cek agar seller a tidak bisa mengubah produk milik seller b
  if (product.owner !== owner) {
    console.log(product)
    return res.status(403).json({ success: false, message: "You can only update your own products!" });
  }

  // Update produk
  product.productCategory = productCategory;
  product.price = price;
  product.owner = owner;

  res.json({ success: true, message: "Product updated successfully!", product });
};

// Delete product by product_name
exports.deleteProduct = (req, res) => {
  const { product_name } = req.params;

  const productIndex = products.findIndex(p => p.productName === product_name);
  if (productIndex === -1) {
    console.log(productIndex)
    return res.status(404).json({ success: false, message: "Product not found!" });
  }

  products.splice(productIndex, 1);
  res.json({ success: true, message: "Product deleted successfully!" });
};