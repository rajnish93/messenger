import { useSelector } from 'react-redux';
import { selectedChat } from '../../redux/selectors';
import ChatInput from './ChatInput';
import MessageList from './MessageList';
import ChatHeader from './ChatHeader';

// ChatWindow - Main chat area displaying header, messages, input, and group actions.
const ChatWindow = () => {
  // Selectors
  const selectedChatData = useSelector(selectedChat);

  // Render: No chat selected
  if (!selectedChatData) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-500 mb-2">
            Select a contact or group to start chatting
          </h3>
        </div>
      </div>
    );
  }

  // Render: Chat window
  return (
    <div className="flex-1 flex flex-col">
      <ChatHeader />
      <MessageList />
      <ChatInput />
    </div>
  );
};

export default ChatWindow;
