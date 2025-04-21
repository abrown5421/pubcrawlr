import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ModalState } from '../../types/globalTypes';

const initialState: ModalState = {
  open: false,
  title: '',
  body: '',
  closeable: true, 
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setModal(state, action: PayloadAction<ModalState>) {
      state.open = action.payload.open;
      state.title = action.payload.title;
      state.body = action.payload.body;
      state.closeable = action.payload.closeable ?? true; 
    },
    closeModal(state) {
      state.open = false;
    },
  },
});

export const { setModal, closeModal } = modalSlice.actions;

export default modalSlice.reducer;
