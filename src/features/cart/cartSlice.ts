import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  nameAr: string;
  price: number;
  quantity: number;
  modifiers: { name: string; nameAr: string; price: number }[];
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<Omit<CartItem, 'id'>>) {
      const id = `${action.payload.productId}-${Date.now()}`;
      state.items.push({ ...action.payload, id });
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
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;

export const selectCartTotal = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, item) => {
    const modifiersTotal = item.modifiers.reduce((m, mod) => m + mod.price, 0);
    return sum + (item.price + modifiersTotal) * item.quantity;
  }, 0);

export const selectCartItemCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);

export default cartSlice.reducer;
