import type { Chat, Message, User } from '../../redux/types';
import { formatTime } from '../../utils/time';

/**
 * UserListItem - Renders a user in the chat sidebar with their avatar, name, and last message.
 * Highlights if selected and shows the time of the last message.
 */
interface UserListItemProps {
  user: User;
  isSelected: boolean;
  currentUserId: string | undefined;
  chats: Chat[];
  onClick: () => void;
}

const UserListItem = ({
  user,
  isSelected,
  currentUserId,
  chats,
  onClick,
}: UserListItemProps) => {
  
  // Get the last message exchanged with this user.
  const getLastMessage = (): Message | undefined => {
    const messages: Message[] = [];

    chats.forEach((chat) => {
      chat.messages.forEach((message) => {
        if (
          (message.senderId === currentUserId &&
            message.receiverId === user.id) ||
          (message.senderId === user.id && message.receiverId === currentUserId)
        ) {
          messages.push(message);
        }
      });
    });

    if (messages.length === 0) return undefined;
    
    return messages
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      )
      .at(-1);
  };

  const lastMessage = getLastMessage();

  // Render
  return (
    <div
      onClick={onClick}
      className={`p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100 transition-colors ${
        isSelected ? 'bg-blue-50 border-blue-200' : ''
      }`}
    >
      <div className="flex items-center">
        <div className="text-2xl mr-3">{user.avatar}</div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-800">{user.name}</div>
          {lastMessage && (
            <div className="text-sm text-gray-500 truncate">
              {lastMessage.senderId === currentUserId ? 'You: ' : ''}
              {lastMessage.text}
            </div>
          )}
        </div>
        {lastMessage && (
          <div className="text-xs text-gray-400 ml-2 whitespace-nowrap">
            {formatTime(lastMessage.timestamp)}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserListItem;
