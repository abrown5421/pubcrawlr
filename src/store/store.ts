import { configureStore } from "@reduxjs/toolkit";
import viewportReducer from "./slices/viewportSlice";
import activePageReducer from "./slices/activePageSlice";

export const store = configureStore({
  reducer: {
    viewport: viewportReducer,
    activePage: activePageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
