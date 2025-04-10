import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ButtonLoadState {
  [key: string]: boolean;
}

const initialState: ButtonLoadState = {};

const buttonLoadSlice = createSlice({
  name: 'buttonLoad',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<{ key: string; value: boolean }>) => {
      state[action.payload.key] = action.payload.value;
    }
  },
});

export const { setLoading } = buttonLoadSlice.actions;
export default buttonLoadSlice.reducer;
