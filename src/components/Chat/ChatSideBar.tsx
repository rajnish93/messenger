import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../redux/store';
import { currentUser, selectedUser, selectedUserChats } from '../../redux/selectors';
import { logout, setSelectedUser } from '../../redux/messengerSlice';
import { LogOut } from 'lucide-react';
import UserListItem from './UserListItem';
import { users } from '../../utils/users';

const ChatSideBar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const loggedInUser = useSelector(currentUser);
  const userList = users.filter(user => user.id !== loggedInUser?.id);
  const selectUser = useSelector(selectedUser);
  const chats = useSelector(selectedUserChats)


  return (
    <div className="h-screen w-80 bg-white border-r border-gray-200 flex flex-col">
    <div className="p-4 bg-blue-500 text-white flex items-center justify-between">
      <div className="flex items-center">
        <div className="text-2xl mr-3">{loggedInUser?.avatar}</div>
        <div>
          <div className="font-medium">{loggedInUser?.name}</div>
          <div className="text-sm text-blue-100">Online</div>
        </div>
      </div>
      <button
        onClick={() => dispatch(logout())}
        className="p-2 hover:bg-blue-600 rounded-lg transition-colors">
       <LogOut size={20} />
      </button>
    </div>
    <div className="p-4 border-b border-gray-200">
      <h2 className="text-sm font-semibold text-gray-600">Chats</h2>
    </div>
    <div className="flex-1 overflow-y-auto">
      {userList.map(user => (
        <UserListItem
          key={user.id}
          user={user}
          isSelected={selectUser?.id === user.id}
          currentUserId={loggedInUser?.id}
          chats={chats}
          onClick={() => dispatch(setSelectedUser(user))}
        />
      ))}
    </div>
  </div>
  );
};

export default ChatSideBar;
