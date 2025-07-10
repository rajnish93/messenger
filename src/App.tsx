import { useSelector } from 'react-redux';
import Login from './components/Login';
import { isLoggedIn } from './redux/selectors';
import ChatWindow from './components/Chat/ChatWindow';
import ChatSideBar from './components/Chat/ChatSideBar';

const App = () => {
  const isSignIn = useSelector(isLoggedIn);

  if (!isSignIn) {
    return <Login />;
  }

  return (
    <div className="flex h-screen">
      <ChatSideBar />
      <ChatWindow />
    </div>
  );
};

export default App;
