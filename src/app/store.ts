import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import sessionReducer from '@/features/session/sessionSlice';
import branchReducer from '@/features/branch/branchSlice';
import menuReducer from '@/features/menu/menuSlice';
import cartReducer from '@/features/cart/cartSlice';
import checkoutReducer from '@/features/checkout/checkoutSlice';

export const store = configureStore({
  reducer: {
    session: sessionReducer,
    branch: branchReducer,
    menu: menuReducer,
    cart: cartReducer,
    checkout: checkoutReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
