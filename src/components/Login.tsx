import { useState } from 'react';
import { useDispatch } from 'react-redux';
import type { User } from '../redux/types';
import type { AppDispatch } from '../redux/store';
import { setLoggedIn, setCurrentUser } from '../redux/messengerSlice';

const users: User[] = [
  { id: '1', name: 'Amit Kumar', avatar: '🧑‍💼' },
  { id: '2', name: 'Nishant Kumar', avatar: '🧑‍⚕️' },
  { id: '3', name: 'Saurav Singh', avatar: '👨‍⚕️' },
  { id: '4', name: 'Rajnish Singh', avatar: '👨‍⚕️' },
];

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  const handleLogin = () => {
    const selectedUser = users.find((user) => user.id === selectedUserId);
    if (!selectedUser) return;

    dispatch(setCurrentUser(selectedUser));
    dispatch(setLoggedIn(true));
  };

  return (
    <div className="flex h-screen flex-1 flex-col justify-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Sign in
        </h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-6">
        <div>
          <label
            htmlFor="user"
            className="block text-sm/6 font-medium text-gray-900"
          >
            Select user
          </label>
          <div className="mt-2">
            <select
              id="user"
              name="user"
              required
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            >
              <option value="">-- Choose a user --</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.avatar} {user.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <button
            type="button"
            onClick={handleLogin}
            disabled={!selectedUserId}
            className="flex w-full justify-center cursor-pointer rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
