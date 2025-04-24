import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RequestsState } from '../../types/globalTypes';

const initialState: RequestsState = {
  open: false,
  requests: 0,
};

const requestSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    setRequests(state, action: PayloadAction<RequestsState>) {
      state.open = action.payload.open;
      state.requests = action.payload.requests;
    },
    clearRequests(state) {
      state.open = false;
      state.requests = 0;
    }
  }
});

export const { setRequests, clearRequests } = requestSlice.actions;

export default requestSlice.reducer;
