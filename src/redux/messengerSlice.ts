import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Message, MessengerState, User } from './types';

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
    setMessage(state, action: PayloadAction<Message>) {
      const message = action.payload;
      const targetUserId =
        message.senderId === state.currentUser?.id
          ? message.receiverId
          : message.senderId;
      const existingChatIndex = state.chats.findIndex(
        (chat) => chat.userId === targetUserId
      );

      if (existingChatIndex >= 0) {
        state.chats[existingChatIndex].messages.push(message);
      } else {
        state.chats.push({ userId: targetUserId, messages: [message] });
      }
    },
  },
});

export const {
  setLoggedIn,
  setCurrentUser,
  logout,
  setSelectedUser,
  setMessage,
} = messengerSlice.actions;

export default messengerSlice.reducer;
