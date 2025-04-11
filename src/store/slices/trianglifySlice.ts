import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TrianglifyState } from '../../types/globalTypes';

const initialState: TrianglifyState = {
  cellSize: 100,
  variance: 0.75,
  xColors: ['#09599C', '#ADDFBA'],
  yColors: ['#4389B3', '#F0F9EA'],
};

const trianglifySlice = createSlice({
  name: 'trianglify',
  initialState,
  reducers: {
    setTrianglifyValue: <K extends keyof TrianglifyState>(
      state: TrianglifyState,
      action: PayloadAction<{ key: K; value: TrianglifyState[K] }>
    ) => {
      state[action.payload.key] = action.payload.value;
    },
    resetTrianglify: () => initialState,
    setMultipleTrianglifyValues: (
      state: TrianglifyState,
      action: PayloadAction<Partial<TrianglifyState>>
    ) => {
      Object.assign(state, action.payload);
    },
  },
});

export const { setTrianglifyValue, resetTrianglify, setMultipleTrianglifyValues } = trianglifySlice.actions;
export default trianglifySlice.reducer;