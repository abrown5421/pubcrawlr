import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ViewportState } from "../../types/globalTypes";

const initialState: ViewportState = {
  width: window.innerWidth,
  height: window.innerHeight,
  type: "desktop", 
};

const viewportSlice = createSlice({
  name: "viewport",
  initialState,
  reducers: {
    setViewport(state, action: PayloadAction<{ width: number; height: number }>) {
      const { width, height } = action.payload;
      state.width = width;
      state.height = height;

      if (width <= 600) {
        state.type = "mobile";
      } else if (width <= 1024) {
        state.type = "tablet";
      } else {
        state.type = "desktop";
      }
    },
  },
});

export const { setViewport } = viewportSlice.actions;
export default viewportSlice.reducer;
