export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface MessengerState {
  isLoggedIn: boolean;
  currentUser: User | null;
}
