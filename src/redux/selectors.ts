import type { RootState } from './store';
import { users } from '../utils/users';
import type { User } from './types';

/**
 * Selectors for messenger state.
 * These functions extract specific pieces of state for use in components.
 */

// Basic Selectors
export const isLoggedIn = (state: RootState) => state.messenger.isLoggedIn;
export const currentUser = (state: RootState) => state.messenger.currentUser;
export const selectedChat = (state: RootState) => state.messenger.selectedChat;
export const chats = (state: RootState) => state.messenger.chats;
export const groups = (state: RootState) => state.messenger.groups;

// Get the selected user object based on selectedChat.
export const selectedUser = (state: RootState) => {
  const selectedChat = state.messenger.selectedChat;
  if (!selectedChat || selectedChat.type !== 'user') return null;

  return users.find((user: User) => user.id === selectedChat.id) || null;
};

// Get the selected group object based on selectedChat.
export const selectedGroup = (state: RootState) => {
  const selectedChat = state.messenger.selectedChat;
  if (!selectedChat || selectedChat.type !== 'group') return null;

  return (
    state.messenger.groups.find((group) => group.id === selectedChat.id) || null
  );
};

// Get messages for the selected chat (user or group).
export const selectedChatMessages = (state: RootState) => {
  const selectedChat = state.messenger.selectedChat;
  if (!selectedChat) return [];

  const chat = state.messenger.chats.find((c) => {
    if (selectedChat.type === 'user') {
      return c.userId === selectedChat.id;
    } else {
      return c.groupId === selectedChat.id;
    }
  });

  return chat?.messages || [];
};

// Get unread message count for a chat (user or group) for the current user
export const getUnreadCount = (
  state: RootState,
  chatType: 'user' | 'group',
  chatId: string
): number => {
  const { currentUser, chats } = state.messenger;
  if (!currentUser) return 0;

  const chat = chats.find((c) =>
    chatType === 'user' ? c.userId === chatId : c.groupId === chatId
  );
  if (!chat) return 0;

  const userId = currentUser.id;

  if (chatType === 'user') {
    // Unread messages sent to the current user
    return chat.messages.reduce(
      (count, msg) =>
        msg.receiverId === userId && !msg.readBy?.includes(userId)
          ? count + 1
          : count,
      0
    );
  } else {
    // Unread group messages not sent by the current user
    return chat.messages.reduce(
      (count, msg) =>
        msg.senderId !== userId && !msg.readBy?.includes(userId)
          ? count + 1
          : count,
      0
    );
  }
};
