// cart.repository.test.js
// Menguji fungsi repository cart dengan mock prisma client

jest.mock("./prisma", () => {
  // Simulasi data in-memory untuk pengujian
  let carts = [
    {
      id: 1,
      buyerId: "buyer-uuid-001",
      items: [
        { id: 1, cartId: 1, productId: 1, quantity: 2 },
        { id: 2, cartId: 1, productId: 2, quantity: 1 },
      ],
    },
  ];

  let products = [
    { id: 1, productName: "Pedigree", productCategory: "Makanan Anjing", price: 3000000, ownerId: "seller-uuid-001" },
    { id: 2, productName: "Whiskas", productCategory: "Makanan Kucing", price: 1500000, ownerId: "seller-uuid-001" },
  ];

  return {
    cart: {
      findMany: jest.fn(() => Promise.resolve(carts.slice())),
      findUnique: jest.fn(({ where }) => Promise.resolve(carts.find((c) => c.id === where.id) || null)),
      create: jest.fn(({ data }) => {
        const newCart = { id: carts.length + 1, ...data, items: [] };
        carts.push(newCart);
        return Promise.resolve(newCart);
      }),
      update: jest.fn(({ where, data }) => {
        const idx = carts.findIndex((c) => c.id === where.id);
        if (idx === -1) throw new Error("Cart not found");
        carts[idx] = { ...carts[idx], ...data };
        return Promise.resolve(carts[idx]);
      }),
      delete: jest.fn(({ where }) => {
        const idx = carts.findIndex((c) => c.id === where.id);
        if (idx === -1) throw new Error("Cart not found");
        const removed = carts.splice(idx, 1)[0];
        return Promise.resolve(removed);
      }),
    },
    cartItem: {
      create: jest.fn(({ data }) => {
        const newItem = { id: Date.now(), ...data };
        const cart = carts.find((c) => c.id === data.cartId);
        if (cart) cart.items.push(newItem);
        return Promise.resolve(newItem);
      }),
      delete: jest.fn(({ where }) => {
        for (const cart of carts) {
          const idx = cart.items.findIndex((i) => i.id === where.id);
          if (idx !== -1) {
            const removed = cart.items.splice(idx, 1)[0];
            return Promise.resolve(removed);
          }
        }
        throw new Error("CartItem not found");
      }),
    },
    product: {
      findUnique: jest.fn(({ where }) => Promise.resolve(products.find((p) => p.id === where.id) || null)),
    },
    __setData: (newCarts, newProducts) => {
      carts = newCarts.slice();
      products = newProducts.slice();
    },
    __reset: () => {
      carts = [];
      products = [];
    },
  };
});

const prisma = require("./prisma");
const cartRepository = require("./cart.repository");

describe("CartRepository (jest mock prisma)", () => {
  beforeEach(() => {
    prisma.__setData(
      [
        {
          id: 1,
          buyerId: "buyer-uuid-001",
          items: [
            { id: 1, cartId: 1, productId: 1, quantity: 2 },
            { id: 2, cartId: 1, productId: 2, quantity: 1 },
          ],
        },
      ],
      [
        { id: 1, productName: "Pedigree", productCategory: "Makanan Anjing", price: 3000000, ownerId: "seller-uuid-001" },
        { id: 2, productName: "Whiskas", productCategory: "Makanan Kucing", price: 1500000, ownerId: "seller-uuid-001" },
      ]
    );
  });

  afterEach(() => {
    prisma.__reset();
  });

  test("findAll returns all carts", async () => {
    const carts = await cartRepository.findAll();
    expect(Array.isArray(carts)).toBe(true);
    expect(carts).toHaveLength(1);
    expect(carts[0].items).toHaveLength(2);
  });

  test("findById returns correct cart", async () => {
    const cart = await cartRepository.findById(1);
    expect(cart).not.toBeNull();
    expect(cart.buyerId).toBe("buyer-uuid-001");
    expect(cart.items).toHaveLength(2);
  });

  test("create creates a new cart", async () => {
    const newCart = await cartRepository.create({
      buyerId: "buyer-uuid-002",
    });
    expect(newCart).toMatchObject({ buyerId: "buyer-uuid-002" });

    const all = await cartRepository.findAll();
    expect(all).toHaveLength(2);
  });

  test("addItem adds product to cart", async () => {
    const item = await cartRepository.addItem(1, 1, 3);
    expect(item).toMatchObject({ cartId: 1, productId: 1, quantity: 3 });

    const cart = await cartRepository.findById(1);
    expect(cart.items.some((i) => i.productId === 1)).toBe(true);
  });

  test("removeItem removes item from cart", async () => {
    const cart = await cartRepository.findById(1);
    const itemId = cart.items[0].id;

    const removed = await cartRepository.removeItem(itemId);
    expect(removed.id).toBe(itemId);

    const updatedCart = await cartRepository.findById(1);
    expect(updatedCart.items.some((i) => i.id === itemId)).toBe(false);
  });

  test("delete removes a cart", async () => {
    const deleted = await cartRepository.delete(1);
    expect(deleted.id).toBe(1);

    const all = await cartRepository.findAll();
    expect(all).toHaveLength(0);
  });
});
