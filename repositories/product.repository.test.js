jest.mock("./prisma", () => {
    // Mocked product data and Prisma methods for testing
    let products = [
        {
            id: 1,
            productName: "Pedigree",
            productCategory: "Makanan Anjing",
            price: 3000000,
            ownerId: "41cb97a0-1dcd-42fa-9d22-57afd43259f9",
        },
        {
            id: 2,
            productName: "Whiskas",
            productCategory: "Makanan Kucing",
            price: 2500000,
            ownerId: "52dc97a0-2dcd-43fa-8d22-67afd43260g0",
        },
    ];

    return {
        product: {
            // Returns all products
            findMany: jest.fn(() => Promise.resolve(products.slice())),

            // Finds product by productName or id
            findFirst: jest.fn(({ where }) =>
                Promise.resolve(
                    products.find(
                        (p) =>
                            p.productName === where.productName ||
                            p.id === where.id
                    ) || null
                )
            ),

            // Creates a new product
            create: jest.fn(({ data }) => {
                const newProduct = { id: products.length + 1, ...data };
                products.push(newProduct);
                return Promise.resolve(newProduct);
            }),

            // Updates a product by id
            update: jest.fn(({ where, data }) => {
                const idx = products.findIndex((p) => p.id === where.id);
                if (idx === -1) throw new Error("Product not found");
                products[idx] = { ...products[idx], ...data };
                return Promise.resolve(products[idx]);
            }),

            // Deletes a product by id
            delete: jest.fn(({ where }) => {
                const idx = products.findIndex((p) => p.id === where.id);
                if (idx === -1) throw new Error("Product not found");
                const deleted = products.splice(idx, 1)[0];
                return Promise.resolve(deleted);
            }),
        },

        // Utility to set and reset mock data
        __setData: (arr) => {
            products = arr.slice();
        },

        __reset: () => {
            products = [];
        },
    };
});

const productRepository = require("./product.repository");
const prisma = require("./prisma");

describe("ProductRepository (jest mock prisma)", () => {
    beforeEach(() => {
        prisma.__setData([
            {
                id: 1,
                productName: "Pedigree",
                productCategory: "Makanan Anjing",
                price: 3000000,
                ownerId: "41cb97a0-1dcd-42fa-9d22-57afd43259f9",
            },
            {
                id: 2,
                productName: "Whiskas",
                productCategory: "Makanan Kucing",
                price: 2500000,
                ownerId: "52dc97a0-2dcd-43fa-8d22-67afd43260g0",
            },
        ]);
    });

    afterEach(() => {
        prisma.__reset();
    });

    test("getAllProducts returns all products", async () => {
        const products = await productRepository.getAllProducts();
        expect(products).toHaveLength(2);
        expect(products[0].productName).toBe("Pedigree");
        expect(products[1].productName).toBe("Whiskas");
    });

    test("getProductByName returns the correct product", async () => {
        const product = await productRepository.getProductByName("Whiskas");
        expect(product).not.toBeNull();
        expect(product.productName).toBe("Whiskas");
        expect(product.productCategory).toBe("Makanan Kucing");
        expect(product.price).toBe(2500000);
        expect(product.ownerId).toBe("52dc97a0-2dcd-43fa-8d22-67afd43260g0");
    });

    test("createProduct adds a new product", async () => {
        const newProduct = {
            productName: "Royal Canin",
            productCategory: "Makanan Kucing Premium",
            price: 4000000,
            ownerId: "13ed97a0-3dcd-43fa-8d22-99afd43277a9",
        };
        const created = await productRepository.createProduct(newProduct);
        expect(created).toMatchObject(newProduct);
        expect(prisma.product.create).toHaveBeenCalledWith({ data: newProduct });

        const products = await productRepository.getAllProducts();
        expect(products).toHaveLength(3);
        expect(products.find((p) => p.productName === "Royal Canin")).toBeDefined();
    });

    test("updateProduct modifies an existing product", async () => {
        const updatedFields = { price: 2800000 };
        const updated = await productRepository.updateProduct("Pedigree", updatedFields);
        expect(updated.price).toBe(2800000);

        const products = await productRepository.getAllProducts();
        expect(products).toHaveLength(2);
        expect(products[0].price).toBe(2800000);
    });

    test("deleteProduct removes a product", async () => {
        const deleted = await productRepository.deleteProduct("Whiskas");
        expect(deleted.productName).toBe("Whiskas");

        const products = await productRepository.getAllProducts();
        expect(products).toHaveLength(1);
        expect(products.find((p) => p.productName === "Whiskas")).toBeUndefined();
    });
});
