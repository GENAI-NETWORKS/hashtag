import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { LocalCartItem, Product, ProductVariant, Customization } from '@/types';

interface CartStore {
  items: LocalCartItem[];
  isOpen: boolean;

  // Actions
  addItem: (product: Product, variant?: ProductVariant, customization?: Customization, qty?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // Computed (called as functions)
  getItemCount: () => number;
  getSubtotal: () => number;
  getItemByProductId: (productId: number, variantId?: number) => LocalCartItem | undefined;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, variant, customization, qty = 1) => {
        const { items } = get();
        const existingIndex = items.findIndex(
          (item) =>
            item.productId === product.id &&
            item.variantId === variant?.id &&
            item.customizationId === customization?.id
        );

        if (existingIndex >= 0) {
          // Update quantity optimistically
          const updated = [...items];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + qty,
          };
          set({ items: updated });
        } else {
          set({
            items: [
              ...items,
              {
                id: generateId(),
                productId: product.id,
                variantId: variant?.id,
                customizationId: customization?.id,
                quantity: qty,
                product,
                variant,
                customization,
              },
            ],
          });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set({ isOpen: !get().isOpen }),

      getItemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

      getSubtotal: () =>
        get().items.reduce((sum, item) => {
          const base = Number(item.product.basePrice);
          const variantMod = Number(item.variant?.priceModifier || 0);
          return sum + (base + variantMod) * item.quantity;
        }, 0),

      getItemByProductId: (productId, variantId) =>
        get().items.find(
          (item) => item.productId === productId && item.variantId === variantId
        ),
    }),
    {
      name: 'hashtag-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
