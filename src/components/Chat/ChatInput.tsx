import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { currentUser, selectedChat, selectedUser, selectedGroup } from '../../redux/selectors';
import type { AppDispatch } from '../../redux/store';
import { setMessage } from '../../redux/messengerSlice';

/**
 * ChatInput - Input box and send button for composing and sending messages.
 * Handles both user and group chats.
 */
const ChatInput = () => {
  // State and Selectors
  const [messageText, setMessageText] = useState('');
  const selectedChatData = useSelector(selectedChat);
  const selectedUserData = useSelector(selectedUser);
  const selectedGroupData = useSelector(selectedGroup);
  const loggedInUser = useSelector(currentUser);
  const dispatch = useDispatch<AppDispatch>();

  // Send a message to the current chat (user or group)
  const sendMessage = () => {
    if (!messageText.trim() || !selectedChatData || !loggedInUser) return;

    // Ensure receiverId is always set correctly
    let receiverId = '';
    if (selectedChatData.type === 'user') {
      if (!selectedUserData) return; 
      receiverId = selectedUserData.id;
    } else if (selectedChatData.type === 'group') {
      if (!selectedGroupData) return; 
      receiverId = selectedGroupData.id;
    }

    const newMessage = {
      id: Date.now().toString(),
      senderId: loggedInUser.id,
      receiverId,
      text: messageText.trim(),
      timestamp: new Date().toISOString(),
    };

    dispatch(setMessage({
      message: newMessage,
      target: selectedChatData.type,
      id: selectedChatData.id,
    }));
    setMessageText('');
  };

  // Handle Enter key to send message (without Shift).
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Render
  // Don't render if no chat is selected
  if (!selectedChatData) {
    return null;
  }

  return (
    <div className="p-4 bg-white border-t border-gray-200">
      <div className="flex items-center">
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={sendMessage}
          disabled={!messageText.trim()}
          className="ml-3 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
