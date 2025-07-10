import { useSelector } from 'react-redux';
import { selectedUser } from '../../redux/selectors';

const ChatWindow = () => {
  const selectUser = useSelector(selectedUser);

  if (!selectUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-500 mb-2">
            Select a contact to start chatting
          </h3>
         </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">

    </div>
  );
};

export default ChatWindow;
