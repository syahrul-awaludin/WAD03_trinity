const products = require('../data/productsData.json'); 


exports.createProduct = (req, res) => {
  const { productName, productCategory, price, owner } = req.body;

  // cek kalau nama produk sudah ada
  if (products.find(p => p.productName === productName)) {
    return res.status(400).json({ success: false, message: "Product name must be unique!" });
  }

  const newProduct = { productName, productCategory, price, owner };
  products.push(newProduct);
  res.status(201).json(newProduct);
  
};

exports.getProducts = (res) => {
  res.json(products);
};

exports.getProductByName = (req, res) => {
  const product = products.find(p => p.productName === req.params.product_name);
  if (!product) return res.status(404).json({ success: false, message: "Product not found :(" });
  res.json(product);
};
