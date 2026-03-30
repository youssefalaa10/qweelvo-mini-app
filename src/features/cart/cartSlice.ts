import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, CartSummary } from '@/types/session';

interface CartState {
  items: CartItem[];
  summary: CartSummary | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  summary: null,
  isLoading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart(state, action: PayloadAction<CartItem[]>) {
      state.items = Array.isArray(action.payload) ? action.payload : [];
      state.isLoading = false;
      state.error = null;
    },
    setCartSummary(state, action: PayloadAction<CartSummary>) {
      state.summary = action.payload;
    },
    setCartLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setCartError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },
    // Optimistic local updates
    addItem(state, action: PayloadAction<CartItem>) {
      state.items.push(action.payload);
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    updateQuantity(state, action: PayloadAction<{ id: string; quantity: number }>) {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter((i) => i.id !== action.payload.id);
        } else {
          item.quantity = action.payload.quantity;
        }
      }
    },
    clearCart(state) {
      state.items = [];
      state.summary = null;
    },
  },
});

export const { 
  setCart, 
  setCartSummary, 
  setCartLoading, 
  setCartError, 
  addItem, 
  removeItem, 
  updateQuantity, 
  clearCart 
} = cartSlice.actions;

// Local calculate fallbacks if summary isn't fully loaded
export const selectCartTotal = (state: { cart: CartState }) => {
  if (state.cart.summary) return state.cart.summary.total;
  const items = Array.isArray(state.cart.items) ? state.cart.items : [];
  return items.reduce((sum, item) => {
    const modifiersTotal = (item.modifiers || []).reduce((m, mod) => m + mod.price, 0);
    return sum + (item.price + modifiersTotal) * item.quantity;
  }, 0); 
};

export const selectCartItemCount = (state: { cart: CartState }) => {
  const items = Array.isArray(state.cart.items) ? state.cart.items : [];
  return items.reduce((sum, item) => sum + item.quantity, 0);
};

export default cartSlice.reducer;
