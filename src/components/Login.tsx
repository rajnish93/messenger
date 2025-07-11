import { useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../redux/store';
import { setLoggedIn, setCurrentUser } from '../redux/messengerSlice';
import { users } from '../utils/users';

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
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
          Sign in
        </h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-6">
        <div>
          <label
            htmlFor="user"
            className="block text-md font-medium text-gray-900"
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
              className="w-full rounded bg-white py-2 px-3 text-gray-900 border border-gray-300 focus:border-indigo-600"
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
            className="w-full rounded cursor-pointer bg-indigo-600 py-2 text-white font-semibold hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
