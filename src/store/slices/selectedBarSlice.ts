import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SelectedBarsState, Place } from '../../types/globalTypes';

const initialState: SelectedBarsState = {
  selectedBars: [],
};

const selectedBarSlice = createSlice({
  name: 'selectedBars',
  initialState,
  reducers: {
    addBar: (state, action: PayloadAction<Place>) => {
      if (!state.selectedBars.find(bar => bar.name === action.payload.name)) {
        state.selectedBars.push(action.payload);
      }
    },
    removeBar: (state, action: PayloadAction<string>) => {
      state.selectedBars = state.selectedBars.filter(bar => bar.name !== action.payload);
    },
    clearBars: (state) => {
      state.selectedBars = [];
    },
  },
});

export const { addBar, removeBar, clearBars } = selectedBarSlice.actions;
export default selectedBarSlice.reducer;
