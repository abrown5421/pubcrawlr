import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  CreateDate: string;
  UserAvatarType: string;
  UserEmail: string;
  UserFirstName: string;
  UserLastName: string;
  userLocation: {
    latitude: number;
    longitude: number;
  };
}

interface AuthenticationState {
  isAuthenticated: boolean;
  user: User | null;
}

const initialState: AuthenticationState = {
  isAuthenticated: false,
  user: null,
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
    },
  },
});

export const { setUser, clearUser } = authenticationSlice.actions;

export default authenticationSlice.reducer;
