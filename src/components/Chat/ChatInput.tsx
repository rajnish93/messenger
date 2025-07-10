import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { currentUser, selectedUser } from '../../redux/selectors';
import type { AppDispatch } from '../../redux/store';
import { setMessage } from '../../redux/messengerSlice';

const ChatInput = () => {
  const [messageText, setMessageText] = useState('');
  const selectUser = useSelector(selectedUser);
  const loggedInUser = useSelector(currentUser);

  const dispatch = useDispatch<AppDispatch>();

  const sendMessage = () => {
    if (!messageText.trim() || !selectUser || !loggedInUser) return;

    const newMessage = {
      id: Date.now().toString(),
      senderId: loggedInUser.id,
      receiverId: selectUser.id,
      text: messageText.trim(),
      timestamp: new Date().toISOString(),
    };

    dispatch(setMessage(newMessage));
    setMessageText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

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
          className="ml-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
