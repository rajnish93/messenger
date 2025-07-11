import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  currentUser,
  selectedChat,
  selectedUser,
  selectedChatMessages,
} from '../../redux/selectors';
import { formatTime } from '../../utils/time';
import { users } from '../../utils/users';

/**
 * MessageList - Displays the list of messages for the current chat.
 * Handles both user and group chats, and auto-scrolls to the latest message.
 */
const MessageList = () => {
  // State and Selectors
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const selectedChatData = useSelector(selectedChat);
  const selectedUserData = useSelector(selectedUser);
  const loggedInUser = useSelector(currentUser);
  const messages = useSelector(selectedChatMessages);

  // Scroll to the bottom of the message list when messages or chat changes.
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedChatData]);

  // Get the sender's name for a message.
  const getSenderName = (senderId: string): string => {
    if (selectedChatData?.type === 'user') {
      return selectedUserData?.name || 'Unknown User';
    } else if (selectedChatData?.type === 'group') {
      const user = users.find(u => u.id === senderId);
      return user?.name || 'Unknown User';
    }
    return 'Unknown User';
  };

  // Clone messages before sorting to avoid mutating Redux state
  const sortedMessages = [...messages].sort(
    (a, b) =>
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // Filter messages for 1:1 chats to only show those between the logged-in user and the selected user
  let filteredMessages = sortedMessages;
  if (selectedChatData?.type === 'user' && loggedInUser && selectedUserData) {
    filteredMessages = sortedMessages.filter(
      (msg) =>
        (msg.senderId === loggedInUser.id && msg.receiverId === selectedUserData.id) ||
        (msg.senderId === selectedUserData.id && msg.receiverId === loggedInUser.id)
    );
  }

  // Render
  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
      {filteredMessages.map((message) => (
        <div
          key={message.id}
          className={`mb-4 flex ${
            message.senderId === loggedInUser?.id
              ? 'justify-end'
              : 'justify-start'
          }`}
        >
          <div
            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              message.senderId === loggedInUser?.id
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-800 border border-gray-200'
            }`}
          >
            {/* Show sender name for group messages */}
            {selectedChatData?.type === 'group' && (
              <div className="text-xs font-medium mb-1">
                {getSenderName(message.senderId)}
              </div>
            )}
            <div className="text-sm">{message.text}</div>
            <div
              className={`text-xs mt-1 ${
                message.senderId === loggedInUser?.id
                  ? 'text-blue-100'
                  : 'text-gray-500'
              }`}
            >
              {formatTime(message.timestamp)}
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
