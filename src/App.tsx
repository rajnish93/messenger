import { useSelector } from 'react-redux';
import Login from './components/Login';
import { isLoggedIn } from './redux/selectors';
import Header from './components/Chat/Header';
import ChatWindow from './components/Chat/ChatWindow';

const App = () => {
  const isSignIn = useSelector(isLoggedIn);

  if (!isSignIn) {
    return <Login />;
  }

  return (
    <div className="h-screen w-screen">
      <Header />
      <ChatWindow />
    </div>
  );
};

export default App;
