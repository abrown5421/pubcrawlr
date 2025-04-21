import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BarCrawlInfo } from '../../types/globalTypes';

interface SelectedBarCrawlState {
  selectedBarCrawl: BarCrawlInfo | null;
}

const initialState: SelectedBarCrawlState = {
  selectedBarCrawl: null,
};

const selectedBarCrawlSlice = createSlice({
  name: 'selectedBarCrawl',
  initialState,
  reducers: {
    setSelectedBarCrawl(state, action: PayloadAction<BarCrawlInfo>) {
      state.selectedBarCrawl = action.payload;
    },
    clearSelectedBarCrawl(state) {
      state.selectedBarCrawl = null;
    },
  },
});

export const { setSelectedBarCrawl, clearSelectedBarCrawl } = selectedBarCrawlSlice.actions;

export default selectedBarCrawlSlice.reducer;
