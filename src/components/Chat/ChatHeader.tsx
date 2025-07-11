import { useSelector } from 'react-redux';
import { selectedChat, selectedUser, selectedGroup } from '../../redux/selectors';
import { users } from '../../utils/users';
import { useState } from 'react';
import Modal from '../Modal';
import AddUserToGroup from './AddUserToGroup';

// ChatHeader - Displays the header for the current chat (user or group).
const ChatHeader = () => {
  // State and Selectors
  const selectedChatData = useSelector(selectedChat);
  const selectedUserData = useSelector(selectedUser);
  const selectedGroupData = useSelector(selectedGroup);
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  // Render: No chat selected
  if (!selectedChatData) {
    return (
      <div className="p-4 bg-white border-b border-gray-200 flex items-center">
        <div className="text-gray-500">Select a chat to start messaging</div>
      </div>
    );
  }

  // Render: 1:1 User Chat
  if (selectedChatData.type === 'user') {
    return (
      <div className="p-4 bg-white border-b border-gray-200 flex items-center">
        <div className="text-2xl mr-3">{selectedUserData?.avatar}</div>
        <div>
          <div className="font-medium text-gray-800">{selectedUserData?.name}</div>
          <div className="text-sm text-gray-500">Online</div>
        </div>
      </div>
    );
  }

  // Render: Group Chat
  if (selectedChatData.type === 'group') {
    // Get group members' user objects
    const groupMembers = users.filter(user => 
      selectedGroupData?.memberIds.includes(user.id)
    );

    return (
      <div className="p-4 bg-white border-b border-gray-200 flex items-center">
        <div className="text-2xl mr-3">👥</div>
        <div className="flex-1">
          <div className="font-medium text-gray-800">{selectedGroupData?.name}</div>
          <div className="text-sm text-gray-500">
            {groupMembers.length} members
            <button
            type="button"
            onClick={() => setIsAddUserOpen(true)}
            className="ml-2 p-2 rounded cursor-pointer bg-indigo-600 text-white text-xs hover:bg-indigo-500"
          >
            Add Users
          </button>
          </div>     
        </div>
        {/* Show up to 3 member avatars, then a +N badge if more */}
        <div className="flex space-x-1">
          {groupMembers.slice(0, 3).map((member) => (
            <div
              key={member.id}
              className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium"
              title={member.name}
            >
              {member.avatar}
            </div>
          ))}
          {groupMembers.length > 3 && (
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm text-gray-600">
              +{groupMembers.length - 3}
            </div>
          )}
        </div>
        {/* Modal for adding users to group */}
      <Modal isOpen={isAddUserOpen} onClose={() => setIsAddUserOpen(false)}>
        <AddUserToGroup onAddUserToGroup={() => setIsAddUserOpen(false)} />
      </Modal>
      </div>
    );
  }

  // Fallback (should not happen)
  return null;
};

export default ChatHeader;
