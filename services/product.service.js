const productRepository = require('../repositories/product.repository');
const users = require('../data/user.json');

class ProductService {
    createProduct(productData) {
        const { productName, productCategory, price, owner } = productData;


        // Validasi input
        if (!productName || typeof productName !== "string" || productName.trim() === "") {
            const error = new Error("Product name is required and must be a non-empty string.");
            error.status = 400;
            throw error;
        }
        if (!productCategory || typeof productCategory !== "string" || productCategory.trim() === "") {
            const error = new Error("Product category is required and must be a non-empty string.");
            error.status = 400;
            throw error;
        }
        if (price === undefined || typeof price !== "number" || price <= 0) {
            const error = new Error("Price must be a positive number.");
            error.status = 400;
            throw error;
        }
        if (!owner) {
            const error = new Error("Owner is required.");
            error.status = 400;
            throw error;
        }

        const user = users.find(u => u.username === owner);
        if (!user) {
            const error = new Error("User not found.");
            error.status = 404;
            throw error;
        }
        if (user.role.toLowerCase() !== "seller") {
            const error = new Error("Only users with the 'Seller' role can add products.");
            error.status = 403;
            throw error;
        }

        // Cek nama produk unik
        const existingProduct = productRepository.getProductByName(productName);
        if (existingProduct) {
            const error = new Error("Product name must be unique!");
            error.status = 409;
            throw error;
        }

        // Simpan produk baru
        const newProduct = { productName, productCategory, price, owner };
        return productRepository.createProduct(newProduct);
    }


    // Tampilkan semua produk
    getAllProducts() {
        return productRepository.getProducts();
    }

    // Tampilkan produk berdasarkan nama
    getProductByName(product_name) {
        const product = productRepository.getProductByName(product_name);
        if (!product) {
            const error = new Error("Product not found.");
            error.status = 404;
            throw error;
        }
        return product;
    }


    // Update produk berdasarkan nama
    updateProduct(product_name, updatedFields) {
        const existingProduct = productRepository.getProductByName(product_name);
        if (!existingProduct) {
            const error = new Error("Product not found.");
            error.status = 404;
            throw error;
        }

        if (!updatedFields.owner) {
            const error = new Error("Owner is required to verify access.");
            error.status = 400;
            throw error;
        }

        const user = users.find(u => u.username === updatedFields.owner);
        if (!user) {
            const error = new Error("User not found.");
            error.status = 404;
            throw error;
        }

        if (user.role.toLowerCase() !== "seller") {
            const error = new Error("Only sellers can update products.");
            error.status = 403;
            throw error;
        }

        if (existingProduct.owner !== updatedFields.owner) {
            const error = new Error("You can only update your own products.");
            error.status = 403;
            throw error;
        }

        if (updatedFields.productCategory !== undefined) {
            if (typeof updatedFields.productCategory !== "string" || updatedFields.productCategory.trim() === "") {
                const error = new Error("Product category must be a non-empty string.");
                error.status = 400;
                throw error;
            }
        }

        if (updatedFields.price !== undefined) {
            if (typeof updatedFields.price !== "number" || updatedFields.price <= 0) {
                const error = new Error("Price must be a positive number.");
                error.status = 400;
                throw error;
            }
        }

        // Update ke repository
        return productRepository.updateProduct(product_name, updatedFields);
    }

    deleteProduct(product_name) {
        const deletedProduct = productRepository.deleteProduct(product_name);
        if (!deletedProduct) {
            const error = new Error("Product not found.");
            error.status = 404;
            throw error;
        }
        return deletedProduct;
    }
}

module.exports = new ProductService();