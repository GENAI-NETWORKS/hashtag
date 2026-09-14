import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/types';

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      isAuthenticated: false,

      setUser: (user) =>
        set({ user, isAuthenticated: !!user, isLoading: false }),

      setLoading: (isLoading) => set({ isLoading }),

      logout: () =>
        set({ user: null, isAuthenticated: false, isLoading: false }),
    }),
    {
      name: 'hashtag-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
