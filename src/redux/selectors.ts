import type { RootState } from './store';

export const isLoggedIn = (state: RootState) => state.messenger.isLoggedIn;
export const currentUser = (state: RootState) => state.messenger.currentUser;
export const selectedUser = (state: RootState) => state.messenger.selectedUser;
export const selectedUserChats = (state: RootState) => state.messenger.chats;
