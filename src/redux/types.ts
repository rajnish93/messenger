/**
 * Type definitions for messenger state, users, messages, chats, and groups.
 */

export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface MessengerState {
  currentUser: User | null;
  selectedChat: SelectedChat;
  chats: Chat[];
  groups: Group[];
  isLoggedIn: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  readBy?: string[]; // user IDs who have read this message
}

export interface Chat {
  userId?: string;
  groupId?: string;
  messages: Message[];
}

export interface Group {
  id: string;
  name: string;
  memberIds: string[];
}

export type SelectedChat =
  | { type: 'user'; id: string }
  | { type: 'group'; id: string }
  | null;
