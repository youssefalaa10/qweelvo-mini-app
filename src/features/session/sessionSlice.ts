import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SessionInfo, CustomerInfo } from '@/types/session';

interface SessionState {
  token: string | null;
  brand: string | null;
  status: 'idle' | 'loading' | 'valid' | 'invalid' | 'expired';
  info: SessionInfo | null;
  termsAccepted: boolean;
  customerInfo: CustomerInfo | null;
  hasInitialBranch: boolean;
}

const initialState: SessionState = {
  token: null,
  brand: null,
  status: 'idle',
  info: null,
  termsAccepted: false,
  customerInfo: null,
  hasInitialBranch: false,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
    setBrand(state, action: PayloadAction<string>) {
      state.brand = action.payload;
    },
    setSessionStatus(state, action: PayloadAction<SessionState['status']>) {
      state.status = action.payload;
    },
    setSessionInfo(state, action: PayloadAction<SessionInfo>) {
      state.info = action.payload;
      if (action.payload.termsAccepted) {
        state.termsAccepted = true;
      }
      if (action.payload.branchId && state.status === 'valid') {
          // If we are updating session info after initial load, don't overwrite hasInitialBranch.
      } else if (action.payload.branchId) {
          state.hasInitialBranch = true;
      }
    },
    setTermsAccepted(state, action: PayloadAction<boolean>) {
      state.termsAccepted = action.payload;
    },
    setCustomerInfo(state, action: PayloadAction<CustomerInfo>) {
      state.customerInfo = action.payload;
    },
    setSessionExpired(state) {
      state.status = 'expired';
      state.token = null;
      state.info = null;
    }
  },
});

export const { 
  setToken, 
  setBrand, 
  setSessionStatus, 
  setSessionInfo, 
  setTermsAccepted, 
  setCustomerInfo,
  setSessionExpired 
} = sessionSlice.actions;

export default sessionSlice.reducer;
