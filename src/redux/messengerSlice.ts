import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { MessengerState, User } from './types';

const initialState: MessengerState = {
  isLoggedIn: false,
  currentUser: null,
  selectedUser: null,
  chats: [],
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
      state.currentUser = null;
      state.selectedUser = null;
    },
    setSelectedUser(state, action: PayloadAction<User | null>) {
      state.selectedUser = action.payload;
    },
  },
});

export const { setLoggedIn, setCurrentUser, logout, setSelectedUser } =
  messengerSlice.actions;

export default messengerSlice.reducer;
