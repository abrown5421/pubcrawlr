import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BarsState, Place } from '../../types/globalTypes';

const initialState: BarsState = {
  bars: [],
};

const barsSlice = createSlice({
  name: 'bars',
  initialState,
  reducers: {
    addBars: (state, action: PayloadAction<Place[]>) => {
      const newBars = action.payload.filter(
        (newBar) => !state.bars.some((existingBar) => existingBar.id === newBar.id)
      );
      state.bars.push(...newBars);
    },
    removeLocalBar: (state, action: PayloadAction<string>) => {
      state.bars = state.bars.filter(bar => bar.name !== action.payload);
    },
    clearLocalBars: (state) => {
      state.bars = [];
    }
  },
});

export const { addBars, removeLocalBar, clearLocalBars } = barsSlice.actions;
export default barsSlice.reducer;
