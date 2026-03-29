import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CheckoutState {
  name: string;
  phone: string;
  orderType: 'delivery' | 'pickup';
  address: string;
  paymentMethod: 'apple_pay' | 'card';
  status: 'idle' | 'processing' | 'success' | 'error';
  orderNumber: string | null;
}

const initialState: CheckoutState = {
  name: '',
  phone: '',
  orderType: 'pickup',
  address: '',
  paymentMethod: 'card',
  status: 'idle',
  orderNumber: null,
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setName(state, action: PayloadAction<string>) { state.name = action.payload; },
    setPhone(state, action: PayloadAction<string>) { state.phone = action.payload; },
    setOrderType(state, action: PayloadAction<'delivery' | 'pickup'>) { state.orderType = action.payload; },
    setAddress(state, action: PayloadAction<string>) { state.address = action.payload; },
    setPaymentMethod(state, action: PayloadAction<'apple_pay' | 'card'>) { state.paymentMethod = action.payload; },
    setCheckoutStatus(state, action: PayloadAction<CheckoutState['status']>) { state.status = action.payload; },
    setOrderNumber(state, action: PayloadAction<string>) { state.orderNumber = action.payload; },
    resetCheckout() { return initialState; },
  },
});

export const { setName, setPhone, setOrderType, setAddress, setPaymentMethod, setCheckoutStatus, setOrderNumber, resetCheckout } = checkoutSlice.actions;
export default checkoutSlice.reducer;
