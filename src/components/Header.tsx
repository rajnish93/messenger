import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../redux/store';
import { logout } from '../redux/messengerSlice';
import { currentUser } from '../redux/selectors';

const Header = () => {
  const dispatch = useDispatch<AppDispatch>();
  const loggedInUser = useSelector(currentUser);

  return (
    <header className="w-screen bg-blue-600 text-white flex justify-between p-4">
      <div className="flex items-center space-x-2">
        <span className="text-2xl">{loggedInUser?.avatar}</span>
        <span className="font-semibold">{loggedInUser?.name}</span>
      </div>
      <button
        onClick={() => dispatch(logout())}
        className="bg-white text-blue-600 cursor-pointer font-semibold px-4 py-2 rounded hover:bg-gray-100"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;
