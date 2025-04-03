import { configureStore } from "@reduxjs/toolkit";
import viewportReducer from "./slices/viewportSlice";

export const store = configureStore({
  reducer: {
    viewport: viewportReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
