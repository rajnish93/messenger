import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  Chat,
  Group,
  Message,
  MessengerState,
  SelectedChat,
  User,
} from './types';

/**
 * Redux slice for messenger state management.
 * Handles user login, chat selection, messaging, and group management.
 */

// Initial State
const initialState: MessengerState = {
  currentUser: null,
  selectedChat: null,
  chats: [],
  groups: [],
  isLoggedIn: false,
};

// Messenger Slice
const messengerSlice = createSlice({
  name: 'messenger',
  initialState,
  reducers: {
    // Set the current logged-in user
    setCurrentUser(state, action: PayloadAction<User | null>) {
      state.currentUser = action.payload;
    },
    // Set login status
    setLoggedIn(state, action: PayloadAction<boolean>) {
      state.isLoggedIn = action.payload;
    },
    // Log out the user and clear session state
    logout(state) {
      state.isLoggedIn = false;
      state.currentUser = null;
      state.selectedChat = null;
    },
    // Select a chat (user or group)
    setSelectedChat(state, action: PayloadAction<SelectedChat>) {
      state.selectedChat = action.payload;
    },
    /**
     * Add a message to the appropriate chat (user or group).
     * For user-to-user, add to both sender's and receiver's chat objects.
     */
    setMessage(
      state,
      action: PayloadAction<{
        message: Message;
        target: 'user' | 'group';
        id: string;
      }>
    ) {
      const { message, target, id } = action.payload;
      // Initialize readBy with senderId (the sender has read their own message)
      const messageWithReadBy = { ...message, readBy: [message.senderId] };
      if (target === 'user') {
        // Add message to both sender's and receiver's chat objects
        const senderChat = state.chats.find((c) => c.userId === id);
        if (senderChat) {
          senderChat.messages.push(messageWithReadBy);
        } else {
          state.chats.push({ userId: id, messages: [messageWithReadBy] } as Chat);
        }
        // Also add to the reverse chat (so the receiver sees it)
        const receiverChat = state.chats.find(
          (c) => c.userId === message.senderId
        );
        if (receiverChat) {
          receiverChat.messages.push(messageWithReadBy);
        } else {
          state.chats.push({
            userId: message.senderId,
            messages: [messageWithReadBy],
          } as Chat);
        }
      } else {
        // Group chat: add message to the group chat object
        const chat = state.chats.find((c) => c.groupId === id);
        if (chat) {
          chat.messages.push(messageWithReadBy);
        } else {
          state.chats.push({ groupId: id, messages: [messageWithReadBy] } as Chat);
        }
      }
    },
    // Mark all messages in a chat as read by a user
    markMessagesAsRead(
      state,
      action: PayloadAction<{ chatType: 'user' | 'group'; chatId: string; userId: string }>
    ) {
      const { chatType, chatId, userId } = action.payload;
      if (chatType === 'user') {
        // Mark as read in both chat objects (for both users)
        const chatsToMark = state.chats.filter(
          (c) => c.userId === chatId || c.userId === userId
        );
        chatsToMark.forEach((chat) => {
          chat.messages.forEach((msg) => {
            if (!msg.readBy) msg.readBy = [];
            if (!msg.readBy.includes(userId)) {
              msg.readBy.push(userId);
            }
          });
        });
      } else {
        // Group chat: mark as read in the group chat object
        const chat = state.chats.find((c) => c.groupId === chatId);
        if (chat) {
          chat.messages.forEach((msg) => {
            if (!msg.readBy) msg.readBy = [];
            if (!msg.readBy.includes(userId)) {
              msg.readBy.push(userId);
            }
          });
        }
      }
    },
    // Create a new group and initialize its chat.
    createGroup(state, action: PayloadAction<Group>) {
      state.groups.push(action.payload);
      state.chats.push({ groupId: action.payload.id, messages: [] });
    },
    //  Add a user to a group by groupId.
    addUserToGroup(
      state,
      action: PayloadAction<{ groupId: string; userId: string }>
    ) {
      const { groupId, userId } = action.payload;
      const group = state.groups.find((g) => g.id === groupId);
      if (group && !group.memberIds.includes(userId)) {
        group.memberIds.push(userId);
      }
    },
    // Remove a user from a group by groupId.
    removeUserFromGroup(
      state,
      action: PayloadAction<{ groupId: string; userId: string }>
    ) {
      const { groupId, userId } = action.payload;
      const group = state.groups.find((g) => g.id === groupId);
      if (group) {
        group.memberIds = group.memberIds.filter((id) => id !== userId);
      }
    },
  },
});

// Export Actions
export const {
  setLoggedIn,
  setCurrentUser,
  logout,
  setSelectedChat,
  setMessage,
  createGroup,
  addUserToGroup,
  removeUserFromGroup,
  markMessagesAsRead,
} = messengerSlice.actions;

// Export Reducer
export default messengerSlice.reducer;
