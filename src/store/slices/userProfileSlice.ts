import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { profileUserState, User, BarCrawl } from '../../types/globalTypes';

const initialState: profileUserState = {
  profileUser: null,
  barCrawls: [],
};

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    setProfileUser: (state, action: PayloadAction<User>) => {
      state.profileUser = action.payload;
    },
    setBarCrawls: (state, action: PayloadAction<BarCrawl[]>) => {
      state.barCrawls = action.payload;
    },
    removeBarCrawl: (state, action: PayloadAction<string>) => {
      state.barCrawls = state.barCrawls.filter(crawl => crawl.crawlName !== action.payload);
    },
    clearBarCrawls: (state) => {
      state.barCrawls = [];
    },
  },
});

export const { setProfileUser, setBarCrawls, removeBarCrawl, clearBarCrawls } = userProfileSlice.actions;

export default userProfileSlice.reducer;
