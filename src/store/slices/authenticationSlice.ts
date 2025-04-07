import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

export interface User {
  docId: string;
  UserEmail: string;
  UserFirstName: string;
  UserLastName: string;
}

interface AuthenticationState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

const initialState: AuthenticationState = {
  isAuthenticated: false,
  user: null,
  token: Cookies.get('authId') || null, 
};

const authenticationSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
    setAuthToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
  },
});

export const { setUser, clearUser, setAuthToken } = authenticationSlice.actions;

export default authenticationSlice.reducer;
