import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Place {
  name: string;
  geometry: {
    location: {
      lat: () => number; 
      lng: () => number;
    };
  };
  rating?: number;
  user_ratings_total?: number;
  vicinity?: string;
  photoUrl?: string;
}


interface BarsState {
  bars: Place[];
}

const initialState: BarsState = {
  bars: [],
};

const barsSlice = createSlice({
  name: 'bars',
  initialState,
  reducers: {
    addBars: (state, action: PayloadAction<Place[]>) => {
      state.bars.push(...action.payload);
    },
    removeBar: (state, action: PayloadAction<string>) => {
      state.bars = state.bars.filter(bar => bar.name !== action.payload);
    },
    clearBars: (state) => {
      state.bars = [];
    }
  },
});

export const { addBars, removeBar, clearBars } = barsSlice.actions;
export default barsSlice.reducer;
