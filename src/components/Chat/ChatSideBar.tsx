import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../redux/store';
import { currentUser, selectedChat, chats, groups } from '../../redux/selectors';
import { logout, setSelectedChat } from '../../redux/messengerSlice';
import { LogOut, Users } from 'lucide-react';
import UserListItem from './UserListItem';
import { users } from '../../utils/users';
import CreateGroup from './CreateGroup';
import Modal from '../Modal';
import { useState } from 'react';
import type { Group, User } from '../../redux/types';

/**
 * ChatSideBar - Shows user and group chat lists, and allows group creation.
 */
const ChatSideBar = () => {
  // State and Selectors
  const dispatch = useDispatch<AppDispatch>();
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const loggedInUser = useSelector(currentUser);
  const selectedChatData = useSelector(selectedChat);
  // Only show users except the current user
  const userList = users.filter(user => user.id !== loggedInUser?.id);
  // Only show groups the user is a member of
  const groupsList = useSelector(groups).filter(
    (group: Group) => loggedInUser && group.memberIds.includes(loggedInUser.id)
  );
  const chatsList = useSelector(chats);

  // Handlers
  const handleUserClick = (user: User) => {
    dispatch(setSelectedChat({ type: 'user', id: user.id }));
  };

  const handleGroupClick = (group: Group) => {
    dispatch(setSelectedChat({ type: 'group', id: group.id }));
  };

  // Render Helpers
  const renderUserList = () => (
    userList.map(user => (
      <UserListItem
        key={user.id}
        user={user}
        isSelected={selectedChatData?.type === 'user' && selectedChatData?.id === user.id}
        currentUserId={loggedInUser?.id}
        chats={chatsList}
        onClick={() => handleUserClick(user)}
      />
    ))
  );

  const renderGroupList = () => (
    groupsList.map(group => (
      <div
        key={group.id}
        className={`p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
          selectedChatData?.type === 'group' && selectedChatData?.id === group.id
            ? 'bg-blue-50 border-l-4 border-l-blue-500'
            : ''
        }`}
        onClick={() => handleGroupClick(group)}
      >
        <div className="flex items-center">
          <div className="text-xl mr-3">👥</div>
          <div className="flex-1">
            <div className="font-medium text-gray-800">{group.name}</div>
            <div className="text-sm text-gray-500">
              {group.memberIds.length} members
            </div>
          </div>
        </div>
      </div>
    ))
  );

  // Render
  return (
    <div className="h-screen w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header: Current user info and logout */}
      <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center">
          <div className="text-2xl mr-3">{loggedInUser?.avatar}</div>
          <div>
            <div className="font-medium text-gray-800">{loggedInUser?.name}</div>
            <div className="text-sm text-gray-500">Online</div>
          </div>
        </div>
        <button
          onClick={() => dispatch(logout())}
          className="p-2 bg-indigo-600 text-white hover:bg-indigo-500 cursor-pointer rounded"
        >
          <LogOut size={20} />
        </button>
      </div>

      {/* User List Section */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-900">Users</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {renderUserList()}
      </div>

      {/* Group List Section */}
      <div className="p-4 border-t border-gray-200 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900 flex items-center">
          <Users size={16} className="mr-2" />
          Groups
        </h2>
        <button
            type="button"
            onClick={() => setIsCreateGroupOpen(true)}
            className="p-2 rounded cursor-pointer bg-indigo-600 text-white text-xs hover:bg-indigo-500"
          >
            Create
          </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {renderGroupList()}
      </div>

      {/* Modal for Create Group */}
      <Modal isOpen={isCreateGroupOpen} onClose={() => setIsCreateGroupOpen(false)}>
        <CreateGroup onGroupCreated={() => setIsCreateGroupOpen(false)} />
      </Modal>
    </div>
  );
};

export default ChatSideBar;
