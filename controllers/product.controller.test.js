const productService = require('../services/product.service');
const productController = require('./product.controller');
const {
  BadRequestError,
  UnprocessableEntityError,
  NotFoundError,
} = require("../utils/errors");

jest.mock("../services/product.service");

describe('ProductController', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('createProduct', () => {
    test('returns 201 and product on success', async () => {
      req.body = {
        productName: 'Pedigree',
        productCategory: 'Makanan Anjing',
        price: 3000000,
        ownerId: '41cb97a0-1dcd-42fa-9d22-57afd43259f9',
      };
      const product = { ...req.body };
      productService.createProduct.mockResolvedValue(product);

      await productController.createProduct(req, res, next);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ success: true, product });
    });

    test('calls next with BadRequestError if body missing', async () => {
      req.body = undefined;
      await productController.createProduct(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
    });

    test('calls next with UnprocessableEntityError if validation fails', async () => {
      req.body = { productName: '', productCategory: '', price: -100 };
      await productController.createProduct(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(UnprocessableEntityError));
    });

    test('calls next on service error', async () => {
      req.body = {
        productName: 'Pedigree',
        productCategory: 'Makanan Anjing',
        price: 3000000,
        ownerId: '41cb97a0-1dcd-42fa-9d22-57afd43259f9',
      };
      const err = new Error('fail');
      productService.createProduct.mockRejectedValue(err);
      await productController.createProduct(req, res, next);
      expect(next).toHaveBeenCalledWith(err);
    });
  });


  describe('getProducts', () => {
    test('returns products on success', async () => {
      const products = [{ productName: 'Pedigree' }, { productName: 'Whiskas' }];
      productService.getAllProducts.mockResolvedValue(products);
      await productController.getProducts(req, res, next);
      expect(res.json).toHaveBeenCalledWith({ success: true, products });
    });

    test('calls next on service error', async () => {
      const err = new Error('fail');
      productService.getAllProducts.mockRejectedValue(err);
      await productController.getProducts(req, res, next);
      expect(next).toHaveBeenCalledWith(err);
    });
  });


  describe('getProductByName', () => {
    test('returns product on success', async () => {
      req.params = { product_name: 'Pedigree' };
      const product = { productName: 'Pedigree' };
      productService.getProductByName.mockResolvedValue(product);
      await productController.getProductByName(req, res, next);
      expect(res.json).toHaveBeenCalledWith({ success: true, product });
    });

    test('calls next with BadRequestError if product_name missing', async () => {
      req.params = {};
      await productController.getProductByName(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
    });

    test('calls next on service error', async () => {
      req.params = { product_name: 'Pedigree' };
      const err = new NotFoundError('not found');
      productService.getProductByName.mockRejectedValue(err);
      await productController.getProductByName(req, res, next);
      expect(next).toHaveBeenCalledWith(err);
    });
  });

 
  describe('updateProduct', () => {
    test('returns updated product on success', async () => {
      req.params = { product_name: 'Pedigree' };
      req.body = { price: 3500000 };
      const product = { productName: 'Pedigree', price: 3500000 };
      productService.updateProduct.mockResolvedValue(product);
      await productController.updateProduct(req, res, next);
      expect(res.json).toHaveBeenCalledWith({ success: true, product });
    });

    test('calls next with BadRequestError if body missing', async () => {
      req.params = { product_name: 'Pedigree' };
      req.body = undefined;
      await productController.updateProduct(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
    });

    test('calls next with BadRequestError if product_name missing', async () => {
      req.params = {};
      req.body = { price: 3500000 };
      await productController.updateProduct(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
    });

    test('calls next on service error', async () => {
      req.params = { product_name: 'Pedigree' };
      req.body = { price: 3500000 };
      const err = new NotFoundError('not found');
      productService.updateProduct.mockRejectedValue(err);
      await productController.updateProduct(req, res, next);
      expect(next).toHaveBeenCalledWith(err);
    });
  });

 
  describe('deleteProduct', () => {
    test('returns success on delete', async () => {
      req.params = { product_name: 'Pedigree' };
      productService.deleteProduct.mockResolvedValue();
      await productController.deleteProduct(req, res, next);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Product deleted successfully.',
      });
    });

    test('calls next with BadRequestError if product_name missing', async () => {
      req.params = {};
      await productController.deleteProduct(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
    });

    test('calls next on service error', async () => {
      req.params = { product_name: 'Pedigree' };
      const err = new NotFoundError('not found');
      productService.deleteProduct.mockRejectedValue(err);
      await productController.deleteProduct(req, res, next);
      expect(next).toHaveBeenCalledWith(err);
    });
  });
});
