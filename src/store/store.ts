import { configureStore } from '@reduxjs/toolkit';
import viewportReducer from './slices/viewportSlice';
import activePageReducer from './slices/activePageSlice';
import authenticationReducer from './slices/authenticationSlice';
import notificationReducer from './slices/notificationSlice';  
import localBarReducer from './slices/localBarSlice';

export const store = configureStore({
  reducer: {
    viewport: viewportReducer,
    activePage: activePageReducer,
    authentication: authenticationReducer,
    notification: notificationReducer, 
    localBars: localBarReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
