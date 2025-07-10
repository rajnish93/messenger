export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface MessengerState {
  isLoggedIn: boolean;
  currentUser: User | null;
  selectedUser: User | null;
  chats: Chat[];
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
}

export interface Chat {
  userId: string;
  messages: Message[];
}
