import AuthProvider from './provider/AuthProvider';
import Routes from './route/Routes';

function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}

export default App;