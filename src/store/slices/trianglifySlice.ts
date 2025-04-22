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
    randomizeTrianglifyState: (state: TrianglifyState) => {
      state.cellSize = Math.floor(Math.random() * 200) + 50;
      state.variance = Math.random();
      state.xColors = [
        `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        `#${Math.floor(Math.random() * 16777215).toString(16)}`
      ];
      state.yColors = [
        `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        `#${Math.floor(Math.random() * 16777215).toString(16)}`
      ];
    },
  },
});

export const { setTrianglifyValue, resetTrianglify, setMultipleTrianglifyValues, randomizeTrianglifyState } = trianglifySlice.actions;
export default trianglifySlice.reducer;
