import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { currentUser, selectedGroup } from '../../redux/selectors';
import { addUserToGroup } from '../../redux/messengerSlice';
import { UserPlus } from 'lucide-react';
import { users } from '../../utils/users';
import type { User } from '../../redux/types';

/**
 * AddUserToGroup - Modal form for adding users to an existing group.
 * Only shows users not already in the group.
 */
interface AddUserToGroupProps {
  onAddUserToGroup?: () => void;
}

const AddUserToGroup = ({onAddUserToGroup}:AddUserToGroupProps) => {
  // State and Selectors
  const dispatch = useDispatch();
  const loggedInUser = useSelector(currentUser);
  const selectedGroupData = useSelector(selectedGroup);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  // Toggle user selection for adding to the group.
  const handleToggleUser = (id: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  // Add selected users to the group.
  const handleAddUsers = () => {
    if (selectedUserIds.length === 0 || !selectedGroupData) return;

    selectedUserIds.forEach((userId) => {
      dispatch(addUserToGroup({ groupId: selectedGroupData.id, userId }));
    });

    setSelectedUserIds([]);
    if (onAddUserToGroup) onAddUserToGroup();
  };

  // Render: No group selected
  if (!selectedGroupData) {
    return null;
  }

  // Only show users not already in the group and not the current user
  const availableUsers = users.filter(
    (user: User) =>
      user.id !== loggedInUser?.id &&
      !selectedGroupData.memberIds.includes(user.id)
  );

  // Render: All users already in group
  if (availableUsers.length === 0) {
    return (
      <div className="p-4 border-t border-gray-200">
        <h3 className="font-medium text-gray-800 mb-2 flex items-center">
          <UserPlus size={16} className="mr-2" />
          Add Users to Group
        </h3>
        <p className="text-sm text-gray-500">
          All users are already in this group
        </p>
      </div>
    );
  }

  // Render: Add users form
  return (
    <div className="p-4 border-t border-gray-200">
      <h3 className="font-medium text-gray-800 mb-2 flex items-center">
        <UserPlus size={16} className="mr-2" />
        Add Users to Group
      </h3>
      <div className="mb-2 max-h-32 overflow-y-auto">
        {availableUsers.map((user: User) => (
          <label key={user.id} className="block mb-1">
            <input
              type="checkbox"
              checked={selectedUserIds.includes(user.id)}
              onChange={() => handleToggleUser(user.id)}
              className="mr-2 accent-indigo-600"
            />
            <span className="text-sm">{user.name}</span>
          </label>
        ))}
      </div>
      <button
        className="p-2 rounded cursor-pointer bg-indigo-600 text-white text-xs hover:bg-indigo-500 disabled:opacity-50"
        onClick={handleAddUsers}
        disabled={selectedUserIds.length === 0}
      >
        Add
      </button>
    </div>
  );
};

export default AddUserToGroup;