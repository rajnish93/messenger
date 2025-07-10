import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { MessengerState, User } from './types';

const initialState: MessengerState = {
  isLoggedIn: false,
  currentUser: null,
};

const messengerSlice = createSlice({
  name: 'messenger',
  initialState,
  reducers: {
    setCurrentUser(state, action: PayloadAction<User | null>) {
      state.currentUser = action.payload;
    },
    setLoggedIn(state, action: PayloadAction<boolean>) {
      state.isLoggedIn = action.payload;
    },
    logout(state) {
      state.isLoggedIn = false;
    },
  },
});

export const { setLoggedIn, setCurrentUser, logout } = messengerSlice.actions;

export default messengerSlice.reducer;
