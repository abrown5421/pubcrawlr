import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { profileUserState, User, BarCrawl, FriendEntry } from '../../types/globalTypes';
 
const initialState: profileUserState = {
  profileUser: null,
  barCrawls: [],
  invitedBarCrawls: [],
  friends: [],
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
    setInvitedBarCrawls: (state, action: PayloadAction<BarCrawl[]>) => {
      state.invitedBarCrawls = action.payload;
    },
    removeInvitedBarCrawl: (state, action: PayloadAction<string>) => {
      state.invitedBarCrawls = state.invitedBarCrawls.filter(crawl => crawl.crawlName !== action.payload);
    },
    clearInvitedBarCrawls: (state) => {
      state.invitedBarCrawls = [];
    },
    setFriends: (state, action: PayloadAction<FriendEntry[]>) => {
      state.friends = action.payload;
    },
    removeFriend: (state, action: PayloadAction<string>) => {
      state.friends = state.friends.filter(friend => friend.FriendDocId !== action.payload);
    },
  },
});

export const { setProfileUser, setBarCrawls, removeBarCrawl, clearBarCrawls, setInvitedBarCrawls, removeInvitedBarCrawl, clearInvitedBarCrawls, setFriends, removeFriend } = userProfileSlice.actions;

export default userProfileSlice.reducer;
