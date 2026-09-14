import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistStore {
  items: number[]; // Store product IDs
  toggleItem: (id: number) => void;
  hasItem: (id: number) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggleItem: (id) => {
        const items = get().items;
        if (items.includes(id)) {
          set({ items: items.filter((i) => i !== id) });
        } else {
          set({ items: [...items, id] });
        }
      },
      hasItem: (id) => get().items.includes(id),
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'hashtag-wishlist-storage',
    }
  )
);
