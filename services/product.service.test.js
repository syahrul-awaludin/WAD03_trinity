const productService = require('../services/product.service');
const productRepository = require('../repositories/product.repository');
jest.mock("../repositories/product.repository");

afterEach(() => {
    jest.clearAllMocks();
});

describe('createProduct', () => {
    test('creates product successfully', async () => {
        const productData = {
            productName: 'Pedigree',
            productCategory: 'Makanan Anjing',
            price: 3000000,
            ownerId: '41cb97a0-1dcd-42fa-9d22-57afd43259f9',
        };
        productRepository.createProduct.mockResolvedValue(productData);

        const result = await productService.createProduct(productData);
        expect(productRepository.createProduct).toHaveBeenCalledWith(productData);
        expect(result).toEqual(productData);
    });
});

describe('getAllProducts', () => {
    test('returns all products', async () => {
        const products = [
            { productName: 'Pedigree' },
            { productName: 'Whiskas' },
        ];
        productRepository.getAllProducts.mockResolvedValue(products);

        const result = await productService.getAllProducts();
        expect(result).toEqual(products);
    });
});

describe('getProductByName', () => {
    test('returns product if found', async () => {
        const product = {
            productName: 'Pedigree',
            productCategory: 'Makanan Anjing',
            price: 3000000,
            ownerId: '41cb97a0-1dcd-42fa-9d22-57afd43259f9',
        };
        productRepository.getProductByName.mockResolvedValue(product);

        const result = await productService.getProductByName('Pedigree');
        expect(productRepository.getProductByName).toHaveBeenCalledWith('Pedigree');
        expect(result).toEqual(product);
    });

    test('throws error if product not found', async () => {
        productRepository.getProductByName.mockResolvedValue(null);
        await expect(productService.getProductByName('NonExistentProduct'))
            .rejects.toThrow("Product not found.");
    });
});

describe('updateProduct', () => {
    test('updates product successfully', async () => {
        const existingProduct = {
            productName: 'Pedigree',
            productCategory: 'Makanan Anjing',
            price: 3000000,
            ownerId: '41cb97a0-1dcd-42fa-9d22-57afd43259f9',
        };
        const updatedFields = { price: 3200000 };
        const updatedProduct = { ...existingProduct, ...updatedFields };

        productRepository.getProductByName.mockResolvedValue(existingProduct);
        productRepository.updateProduct.mockResolvedValue(updatedProduct);

        const result = await productService.updateProduct('Pedigree', updatedFields);
        expect(productRepository.getProductByName).toHaveBeenCalledWith('Pedigree');
        expect(productRepository.updateProduct).toHaveBeenCalledWith('Pedigree', updatedFields);
        expect(result).toEqual(updatedProduct);
    });

    test('throws error if product to update not found', async () => {
        productRepository.getProductByName.mockResolvedValue(null);
        await expect(
            productService.updateProduct('NonExistentProduct', { price: 3200000 })
        ).rejects.toThrow("Product not found.");
    });
});

describe('deleteProduct', () => {
    test('deletes product successfully', async () => {
        const existingProduct = {
            productName: 'Pedigree',
            productCategory: 'Makanan Anjing',
            price: 3000000,
            ownerId: '41cb97a0-1dcd-42fa-9d22-57afd43259f9',
        };

        productRepository.getProductByName.mockResolvedValue(existingProduct);
        productRepository.deleteProduct.mockResolvedValue(existingProduct);

        const result = await productService.deleteProduct('Pedigree');
        expect(productRepository.getProductByName).toHaveBeenCalledWith('Pedigree');
        expect(productRepository.deleteProduct).toHaveBeenCalledWith('Pedigree');
        expect(result).toEqual(existingProduct);
    });

    test('throws error if product to delete not found', async () => {
        productRepository.getProductByName.mockResolvedValue(null);
        await expect(
            productService.deleteProduct('NonExistentProduct')
        ).rejects.toThrow("Product not found.");
    });
});
