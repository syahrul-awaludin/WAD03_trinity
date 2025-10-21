// repositories/cart.repository.test.js
const cartRepository = require('./cart.repository');
const prisma = require('./prisma'); // Mock stateful

jest.mock('./prisma', () => {
  let carts = [];
  let cartItems = [];
  let products = [];
  let cartIdCounter = 1;
  let cartItemIdCounter = 1;

  const getFullCart = (cart) => {
    if (!cart) return null;
    const items = cartItems
      .filter(item => item.cartId === cart.id)
      .map(item => ({
        ...item,
        product: products.find(p => p.id === item.productId) || null,
      }));
    return { ...cart, items };
  };

  return {
    cart: {
      findFirst: jest.fn(({ where }) => {
        const cart = carts.find(c => c.buyerId === where.buyerId);
        return Promise.resolve(getFullCart(cart));
      }),
      create: jest.fn(({ data, include }) => {
        const newCart = { id: cartIdCounter++, ...data };
        carts.push(newCart);
        return Promise.resolve(include?.items ? getFullCart(newCart) : newCart);
      }),
    },
    cartItem: {
      // [BARU] Mock untuk findCartItemByProductId
      findFirst: jest.fn(({ where }) => {
        const item = cartItems.find(i => 
          i.cartId === where.cartId && i.productId === where.productId
        );
        return Promise.resolve(item || null);
      }),
      create: jest.fn(({ data }) => {
        const newItem = { id: cartItemIdCounter++, ...data };
        cartItems.push(newItem);
        return Promise.resolve(newItem);
      }),
      update: jest.fn(({ where, data }) => {
        const idx = cartItems.findIndex(i => i.id === where.id);
        if (idx === -1) throw new Error('CartItem not found');
        cartItems[idx] = { ...cartItems[idx], ...data };
        return Promise.resolve(cartItems[idx]);
      }),
      // [UBAH] Mock untuk removeCartItemByProductId
      deleteMany: jest.fn(({ where }) => {
        let count = 0;
        const newItems = cartItems.filter(item => {
          const match = item.cartId === where.cartId && item.productId === where.productId;
          if (match) {
            count++;
            return false; // Hapus
          }
          return true; // Pertahankan
        });
        cartItems = newItems;
        return Promise.resolve({ count });
      }),
    },
    __setData: (data) => {
      carts = data.carts ? data.carts.slice() : [];
      cartItems = data.cartItems ? data.cartItems.slice() : [];
      products = data.products ? data.products.slice() : [];
      cartIdCounter = (carts.length > 0 ? Math.max(...carts.map(c => c.id)) : 0) + 1;
      cartItemIdCounter = (cartItems.length > 0 ? Math.max(...cartItems.map(i => i.id)) : 0) + 1;
    },
    __reset: () => {
      carts = []; cartItems = []; products = [];
      cartIdCounter = 1; cartItemIdCounter = 1;
    },
  };
});

describe('Cart Repository', () => {
  
  // --- Data Konsisten dari tes User & Product ---
  const MOCK_SELLER_ID = "41cb97a0-1dcd-42fa-9d22-57afd43259f9";
  
  // Ini adalah asumsi kunci: 
  // Kita harus *menetapkan* UUID untuk 'alice' dari tes user.
  // Mari kita buat UUID baru untuknya agar tidak bentrok dengan seller.
  const MOCK_USER_ALICE_ID = "a11ce-a11ce-a11ce-a11ce-a11ce";

  const MOCK_PRODUCT_PEDIGREE = {
    id: 1,
    productName: "Pedigree",
    price: 3000000,
    ownerId: MOCK_SELLER_ID,
  };
  const MOCK_PRODUCT_WHISKAS = {
    id: 2,
    productName: "Whiskas",
    price: 2500000,
    ownerId: "52dc97a0-2dcd-43fa-8d22-67afd43260g0",
  };
  
  const MOCK_CART_ALICE = { id: 1, buyerId: MOCK_USER_ALICE_ID };
  const MOCK_ITEM_PEDIGREE = { 
    id: 10, 
    cartId: MOCK_CART_ALICE.id, 
    productId: MOCK_PRODUCT_PEDIGREE.id,
    quantity: 2 
  };
  // ----------------------------------------------------

  beforeEach(() => {
    prisma.__setData({
      products: [MOCK_PRODUCT_PEDIGREE, MOCK_PRODUCT_WHISKAS],
      carts: [MOCK_CART_ALICE],
      cartItems: [MOCK_ITEM_PEDIGREE],
    });
  });

  afterEach(() => {
    prisma.__reset();
    jest.clearAllMocks();
  });

  it('should find a cart by user ID with included product details', async () => {
    const cart = await cartRepository.findCartByUserId(MOCK_USER_ALICE_ID);
    expect(cart).not.toBeNull();
    expect(cart.items[0].product).toEqual(MOCK_PRODUCT_PEDIGREE);
  });
  
  it('should create an empty cart', async () => {
    const newUserId = 'user-baru-uuid-789';
    const newCart = await cartRepository.createCart(newUserId);
    expect(newCart.buyerId).toBe(newUserId);
    expect(newCart.items).toEqual([]);
  });

  // --- TES UNTUK LOGIKA BARU/UBAH ---

  it('should find an existing cart item by product ID', async () => {
    const item = await cartRepository.findCartItemByProductId(
      MOCK_CART_ALICE.id,
      MOCK_PRODUCT_PEDIGREE.id
    );
    expect(item).not.toBeNull();
    expect(item.id).toBe(MOCK_ITEM_PEDIGREE.id);
  });
  
  it('should return null when finding non-existent cart item', async () => {
    const item = await cartRepository.findCartItemByProductId(
      MOCK_CART_ALICE.id,
      MOCK_PRODUCT_WHISKAS.id // Whiskas belum ada di keranjang Alice
    );
    expect(item).toBeNull();
  });

  it('should add a new item to a cart', async () => {
    const newItem = await cartRepository.addCartItem(
      MOCK_CART_ALICE.id, 
      MOCK_PRODUCT_WHISKAS.id, 
      1 
    );
    expect(newItem.productId).toBe(MOCK_PRODUCT_WHISKAS.id);
    expect(newItem.id).toBe(11); // 10 sudah ada
  });

  it('should update an item quantity', async () => {
    const updatedItem = await cartRepository.updateItemQuantity(MOCK_ITEM_PEDIGREE.id, 5);
    expect(updatedItem.quantity).toBe(5);
  });

  it('should remove an item from a cart by product ID', async () => {
    // Pastikan item ada dulu
    let cart = await cartRepository.findCartByUserId(MOCK_USER_ALICE_ID);
    expect(cart.items).toHaveLength(1);
    
    // Hapus
    const result = await cartRepository.removeCartItemByProductId(
      MOCK_CART_ALICE.id,
      MOCK_PRODUCT_PEDIGREE.id
    );
    expect(result.count).toBe(1); // Pastikan 1 item terhapus
    
    // Cek state
    cart = await cartRepository.findCartByUserId(MOCK_USER_ALICE_ID);
    expect(cart.items).toHaveLength(0);
  });
});