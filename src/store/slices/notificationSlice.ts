import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NotificationState {
  open: boolean;
  message: string;
  severity: 'error' | 'warning' | 'info' | 'success';
}

const initialState: NotificationState = {
  open: false,
  message: '',
  severity: 'info',
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setAlert(state, action: PayloadAction<NotificationState>) {
      state.open = action.payload.open;
      state.message = action.payload.message;
      state.severity = action.payload.severity;
    },
    closeAlert(state) {
      state.open = false;
    }
  }
});

export const { setAlert, closeAlert } = notificationSlice.actions;

export default notificationSlice.reducer;
