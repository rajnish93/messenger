import { useSelector } from 'react-redux';
import { selectedUser } from '../../redux/selectors';

const ChatHeader = () => {
  const selectUser = useSelector(selectedUser);

  return (
    <div className="p-4 bg-white border-b border-gray-200 flex items-center">
      <div className="text-2xl mr-3">{selectUser?.avatar}</div>
      <div>
        <div className="font-medium text-gray-800">{selectUser?.name}</div>
        <div className="text-sm text-gray-500">Online</div>
      </div>
    </div>
  );
};

export default ChatHeader;
