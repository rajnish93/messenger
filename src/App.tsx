import { useSelector } from 'react-redux';
import Header from './components/Header';
import Login from './components/Login';
import { isLoggedIn } from './redux/selectors';

const App = () => {
  const isSignIn = useSelector(isLoggedIn);

  if (!isSignIn) {
    return <Login />;
  }

  return (
    <div className="h-screen w-screen">
      <Header />
    </div>
  );
};

export default App;
