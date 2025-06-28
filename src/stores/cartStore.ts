import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type CartItem = {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
  productName: string;
  productImage?: string;
};

type CartState = {
  cartId: string | null;
  items: CartItem[];
  isLoading: boolean;
  initializeCart: (userId: string) => Promise<void>;
  addToCart: (item: Omit<CartItem, 'id'>) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  convertGuestCart: (userId: string) => Promise<void>;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartId: null,
      items: [],
      isLoading: false,

      initializeCart: async (userId) => {
        set({ isLoading: true });
        try {
          const res = await fetch('/api/cart');
          const data = await res.json();
          set({ 
            cartId: data.cartId,
            items: data.items || [] 
          });
        } finally {
          set({ isLoading: false });
        }
      },

      addToCart: async (item) => {
        const { items, cartId } = get();
        const existingItem = items.find(
          i => i.productId === item.productId && i.variantId === item.variantId
        );

        let updatedItems;
        if (existingItem) {
          updatedItems = items.map(i =>
            i.productId === item.productId && i.variantId === item.variantId
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          );
        } else {
          updatedItems = [...items, { ...item, id: crypto.randomUUID() }];
        }

        set({ items: updatedItems });
        await syncWithServer(updatedItems, cartId);
      },

      updateQuantity: async (itemId, quantity) => {
        const { items, cartId } = get();
        const updatedItems = items.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        );
        set({ items: updatedItems });
        await syncWithServer(updatedItems, cartId);
      },

      removeFromCart: async (itemId) => {
        const { items, cartId } = get();
        const updatedItems = items.filter(item => item.id !== itemId);
        set({ items: updatedItems });
        await syncWithServer(updatedItems, cartId);
      },

      clearCart: async () => {
        const { cartId } = get();
        set({ items: [] });
        if (cartId) {
          await fetch('/api/cart', { method: 'DELETE' });
        }
      },

      convertGuestCart: async (userId) => {
        const { items } = get();
        if (items.length > 0) {
          const res = await fetch('/api/cart/convert', {
            method: 'POST',
            body: JSON.stringify({ userId, items })
          });
          const data = await res.json();
          set({ cartId: data.cartId });
        }
      }
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items }) // Ne persiste que les items
    }
  )
);

// Helper pour synchroniser avec le serveur
async function syncWithServer(items: CartItem[], cartId: string | null) {
  if (cartId) {
    await fetch('/api/cart', {
      method: 'PUT',
      body: JSON.stringify({ items })
    });
  }
}