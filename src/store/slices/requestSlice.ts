import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RequestsState } from '../../types/globalTypes';

const initialState: RequestsState = {
  open: false,
  requests: {
    total: 0,
    friendRequests: 0,
    barCrawlInvites: 0,
  },
};

const requestSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    setRequests(state, action: PayloadAction<RequestsState>) {
      state.open = action.payload.open;
      state.requests = {
        friendRequests: action.payload.requests.friendRequests,
        barCrawlInvites: action.payload.requests.barCrawlInvites,
        total: action.payload.requests.friendRequests + action.payload.requests.barCrawlInvites,
      };
    },
    clearRequests(state) {
      state.open = false;
      state.requests = {
        total: 0,
        friendRequests: 0,
        barCrawlInvites: 0,
      };
    },
    clearFriendRequests(state) {
      state.requests.friendRequests = 0;
      state.requests.total = state.requests.barCrawlInvites;
    },
    clearBarCrawlInvites(state) {
      state.requests.barCrawlInvites = 0;
      state.requests.total = state.requests.friendRequests;
    },
  }
});

export const {
  setRequests,
  clearRequests,
  clearFriendRequests,
  clearBarCrawlInvites
} = requestSlice.actions;
export default requestSlice.reducer;
