import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { profileUserState, User } from '../../types/globalTypes';

const initialState: profileUserState = {
  profileUser: null,
};

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    setProfileUser: (state, action: PayloadAction<User>) => {
      state.profileUser = action.payload;
    },
  },
});

export const { setProfileUser } = userProfileSlice.actions;

export default userProfileSlice.reducer;
