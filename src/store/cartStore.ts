import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartStore {
  cart: number[];
  wishlist: number[];
  addToCart: (productId: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  isInCart: (productId: number) => boolean;
  addToWishlist: (productId: number) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      
      addToCart: (productId) =>
        set((state) => ({
          cart: state.cart.includes(productId) 
            ? state.cart 
            : [...state.cart, productId],
        })),
      
      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((id) => id !== productId),
        })),
      
      clearCart: () => set({ cart: [] }),
      
      isInCart: (productId) => get().cart.includes(productId),
      
      addToWishlist: (productId) =>
        set((state) => ({
          wishlist: state.wishlist.includes(productId)
            ? state.wishlist
            : [...state.wishlist, productId],
        })),
      
      removeFromWishlist: (productId) =>
        set((state) => ({
          wishlist: state.wishlist.filter((id) => id !== productId),
        })),
      
      isInWishlist: (productId) => get().wishlist.includes(productId),
    }),
    {
      name: 'cart-storage',
    }
  )
);
