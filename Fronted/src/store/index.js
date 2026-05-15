import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ── Auth Store ─────────────────────────────────────────────────────────────
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        localStorage.setItem('sw_token', token);
        set({ user, token, isAuthenticated: true });
      },
      updateUser: (data) => set((s) => ({ user: { ...s.user, ...data } })),
      logout: () => {
        localStorage.removeItem('sw_token');
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    { name: 'sw-auth', partialize: (s) => ({ user: s.user, token: s.token, isAuthenticated: s.isAuthenticated }) }
  )
);

// ── Cart Store (local optimistic state) ───────────────────────────────────
export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],           // [{ product, quantity }]
      isOpen: false,

      openCart:  () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart:() => set((s) => ({ isOpen: !s.isOpen })),

      addItem: (product, quantity = 1) => {
        set((s) => {
          const existing = s.items.find((i) => i.product._id === product._id);
          if (existing) {
            return { items: s.items.map((i) => i.product._id === product._id ? { ...i, quantity: i.quantity + quantity } : i) };
          }
          return { items: [...s.items, { product, quantity }] };
        });
      },

      removeItem: (productId) =>
        set((s) => ({ items: s.items.filter((i) => i.product._id !== productId) })),

      updateQty: (productId, quantity) =>
        set((s) => ({
          items: quantity <= 0
            ? s.items.filter((i) => i.product._id !== productId)
            : s.items.map((i) => i.product._id === productId ? { ...i, quantity } : i),
        })),

      clearCart: () => set({ items: [] }),

      get total() {
        return get().items.reduce((s, i) => s + i.product.price * i.quantity, 0);
      },
      get count() {
        return get().items.reduce((s, i) => s + i.quantity, 0);
      },
    }),
    { name: 'sw-cart', partialize: (s) => ({ items: s.items }) }
  )
);

// ── Wishlist Store ────────────────────────────────────────────────────────
export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],   // product objects
      toggle: (product) => {
        const exists = get().items.find((p) => p._id === product._id);
        set((s) => ({
          items: exists
            ? s.items.filter((p) => p._id !== product._id)
            : [...s.items, product],
        }));
      },
      has: (productId) => !!get().items.find((p) => p._id === productId),
    }),
    { name: 'sw-wishlist', partialize: (s) => ({ items: s.items }) }
  )
);

// ── UI Store ───────────────────────────────────────────────────────────────
export const useUIStore = create((set) => ({
  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),
  mobileMenuOpen: false,
  toggleMobileMenu: () => set((s) => ({ mobileMenuOpen: !s.mobileMenuOpen })),
  closeMobileMenu: () => set({ mobileMenuOpen: false }),
}));
