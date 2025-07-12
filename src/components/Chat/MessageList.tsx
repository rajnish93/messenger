import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  currentUser,
  selectedChat,
  selectedUser,
  selectedChatMessages,
} from '../../redux/selectors';
import { formatTime } from '../../utils/time';
import { users } from '../../utils/users';
import { markMessagesAsRead } from '../../redux/messengerSlice';
import { Check, CheckCheck } from 'lucide-react';

/**
 * MessageList - Displays the list of messages for the current chat.
 * Handles both user and group chats, and auto-scrolls to the latest message.
 */
const MessageList = () => {
  // State and Selectors
  const dispatch = useDispatch();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const selectedChatData = useSelector(selectedChat);
  const selectedUserData = useSelector(selectedUser);
  const loggedInUser = useSelector(currentUser);
  const messages = useSelector(selectedChatMessages);

  // Mark messages as read when chat/messages change
  useEffect(() => {
    if (selectedChatData && loggedInUser) {
      dispatch(
        markMessagesAsRead({
          chatType: selectedChatData.type,
          chatId: selectedChatData.id,
          userId: loggedInUser.id,
        })
      );
    }
  }, [selectedChatData, messages, loggedInUser, dispatch]);

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
      const user = users.find((u) => u.id === senderId);
      return user?.name || 'Unknown User';
    }
    return 'Unknown User';
  };

  // Clone messages before sorting to avoid mutating Redux state
  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // Filter messages for 1:1 chats to only show those between the logged-in user and the selected user
  let filteredMessages = sortedMessages;
  if (selectedChatData?.type === 'user' && loggedInUser && selectedUserData) {
    filteredMessages = sortedMessages.filter(
      (msg) =>
        (msg.senderId === loggedInUser.id &&
          msg.receiverId === selectedUserData.id) ||
        (msg.senderId === selectedUserData.id &&
          msg.receiverId === loggedInUser.id)
    );
  }

  // Render
  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
      {filteredMessages.map((message) => {
        const isCurrentUser = message.senderId === loggedInUser?.id;
        const receiverId = message.receiverId;
        const readBy = message.readBy || [];
        const isReadBySender = readBy.includes(message.senderId);
        const isReadByReceiver = receiverId && readBy.includes(receiverId);
        const isReadByBoth = isReadBySender && isReadByReceiver;
        const isMessageSeen = isCurrentUser && isReadByBoth;
        const isMessageSent =
          isCurrentUser && isReadBySender && !isReadByReceiver;

        return (
          <div
            key={message.id}
            className={`mb-4 flex ${
              isCurrentUser ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                isCurrentUser
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
                className={`text-xs mt-1 flex items-center ${
                  isCurrentUser ? 'text-blue-100' : 'text-gray-500'
                }`}
              >
                {formatTime(message.timestamp)}
                {isMessageSent && message.timestamp && (
                  <Check size={16} className="ml-2" />
                )}
                {isMessageSeen && message.timestamp && (
                  <CheckCheck size={16} className="ml-2 text-blue-100" />
                )}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
