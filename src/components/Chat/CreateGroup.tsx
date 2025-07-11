import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { currentUser } from '../../redux/selectors';
import { createGroup, setSelectedChat } from '../../redux/messengerSlice';
import { users } from '../../utils/users';
import { groups } from '../../redux/selectors';

/**
 * CreateGroup - Modal form for creating a new group and adding users.
 * Prevents duplicate group names and auto-selects the new group.
 */
interface CreateGroupProps {
  onGroupCreated?: () => void;
}

const CreateGroup = ({ onGroupCreated }: CreateGroupProps) => {
  // State and Selectors
  const loggedInUser = useSelector(currentUser);
  const existingGroups = useSelector(groups);
  const dispatch = useDispatch();
  const [groupName, setGroupName] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [error, setError] = useState('');

  // Toggle user selection for group membership.
  const handleToggleUser = (id: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  // Create a new group if the name is unique and users are selected.
  const handleCreateGroup = () => {
    if (!groupName || selectedUserIds.length < 1 || !loggedInUser) return;
    // Check for duplicate group name (case-insensitive)
    const exists = existingGroups.some(
      (g) => g.name.trim().toLowerCase() === groupName.trim().toLowerCase()
    );
    if (exists) {
      setError('A group with this name already exists.');
      return;
    }
    setError('');
    const groupId = Date.now().toString();

    dispatch(
      createGroup({
        id: groupId,
        name: groupName,
        memberIds: [loggedInUser.id, ...selectedUserIds],
      })
    );

    dispatch(setSelectedChat({ type: 'group', id: groupId }));
    setGroupName('');
    setSelectedUserIds([]);
    if (onGroupCreated) onGroupCreated();
  };

  // Render
  return (
    <div className="p-4 border-t border-gray-200">
      <h3 className="font-medium text-gray-800 mb-2">Create Group</h3>
      <input
        type="text"
        placeholder="Group Name"
        className="flex-1 px-2 py-1 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        value={groupName}
        onChange={(e) => {
          setGroupName(e.target.value);
          setError('');
        }}
      />
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      <div className="mb-2">
        {users
          .filter((u) => u.id !== loggedInUser?.id)
          .map((user) => (
            <label key={user.id} className="block">
              <input
                type="checkbox"
                checked={selectedUserIds.includes(user.id)}
                onChange={() => handleToggleUser(user.id)}
                className="accent-indigo-600"
              />
              <span className="ml-2">{user.name}</span>
            </label>
          ))}
      </div>
      <button
        className="p-2 rounded cursor-pointer bg-indigo-600 text-white text-xs hover:bg-indigo-500 disabled:opacity-50"
        onClick={handleCreateGroup}
        disabled={selectedUserIds.length === 0 || !groupName}
      >
        Create
      </button>
    </div>
  );
};

export default CreateGroup;