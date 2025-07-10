import { useEffect, useRef } from 'react';
import type { Message } from '../../redux/types';
import { useSelector } from 'react-redux';
import {
  currentUser,
  selectedUser,
  selectedUserChats,
} from '../../redux/selectors';
import { formatTime } from '../../utils/time';

const MessageList = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const selectUser = useSelector(selectedUser);
  const loggedInUser = useSelector(currentUser);
  const chats = useSelector(selectedUserChats);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats, selectUser]);

  const getCurrentChatMessages = (): Message[] => {
    if (!selectUser || !loggedInUser) return [];

    const allMessages: Message[] = [];

    chats.forEach((chat) => {
      chat.messages.forEach((message) => {
        if (
          (message.senderId === loggedInUser.id &&
            message.receiverId === selectUser.id) ||
          (message.senderId === selectUser.id &&
            message.receiverId === loggedInUser.id)
        ) {
          allMessages.push(message);
        }
      });
    });

    return allMessages.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  };

  const messages = getCurrentChatMessages();

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
      {messages.map((message) => (
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
