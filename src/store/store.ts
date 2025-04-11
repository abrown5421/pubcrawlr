import { configureStore } from '@reduxjs/toolkit';
import viewportReducer from './slices/viewportSlice';
import activePageReducer from './slices/activePageSlice';
import authenticationReducer from './slices/authenticationSlice';
import notificationReducer from './slices/notificationSlice';  
import modalReducer from './slices/modalSlice';  
import localBarReducer from './slices/localBarSlice';
import selectedBarReducer from './slices/selectedBarSlice';
import buttonLoadReducer from './slices/buttonLoadSlice';
import trianglifyReducer from './slices/trianglifySlice';
import userProfileReducer from './slices/userProfileSlice';

export const store = configureStore({
  reducer: {
    viewport: viewportReducer,
    activePage: activePageReducer,
    authentication: authenticationReducer,
    notification: notificationReducer, 
    modal: modalReducer, 
    localBars: localBarReducer,
    selectedBars: selectedBarReducer,
    buttonLoad: buttonLoadReducer,
    trianglify: trianglifyReducer,
    userProfile: userProfileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
