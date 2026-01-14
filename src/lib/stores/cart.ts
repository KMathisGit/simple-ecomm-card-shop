import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  cardInventoryId: string;
  cardId: string;
  name: string;
  imageUrl: string;
  condition: string;
  price: number;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (cardInventoryId: string) => void;
  updateQuantity: (cardInventoryId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item, quantity = 1) => {
        const items = get().items;
        const existing = items.find(
          (i) => i.cardInventoryId === item.cardInventoryId
        );

        if (existing) {
          set({
            items: items.map((i) =>
              i.cardInventoryId === item.cardInventoryId
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
          });
        } else {
          set({ items: [...items, { ...item, quantity }] });
        }
      },

      removeItem: (cardInventoryId) => {
        set({
          items: get().items.filter(
            (i) => i.cardInventoryId !== cardInventoryId
          ),
        });
      },

      updateQuantity: (cardInventoryId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(cardInventoryId);
          return;
        }

        set({
          items: get().items.map((i) =>
            i.cardInventoryId === cardInventoryId ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      totalPrice: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: "pokemon-cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
