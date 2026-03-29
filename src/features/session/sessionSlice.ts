import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SessionState {
  token: string | null;
  status: 'idle' | 'loading' | 'valid' | 'invalid';
}

const initialState: SessionState = {
  token: null,
  status: 'idle',
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
    setSessionStatus(state, action: PayloadAction<SessionState['status']>) {
      state.status = action.payload;
    },
  },
});

export const { setToken, setSessionStatus } = sessionSlice.actions;
export default sessionSlice.reducer;
