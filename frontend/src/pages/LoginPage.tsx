import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../provider/AuthProvider';

const LoginPage = () => {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:3000/login',
        { account, password },
        { withCredentials: true }
      );
      
      const res = await axios.get('http://localhost:3000/auth', {
        withCredentials: true,
      });

      setUser(res.data.user);  // gán user vào AuthProvider

      navigate('/');
    } catch (err) {
      alert('Đăng nhập thất bại');
    }
  };

  const handleRegister = async () => {
    navigate('/register');
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-4 shadow-md border rounded">
      <h2 className="text-2xl font-bold mb-4">Đăng nhập</h2>
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          type="account"
          value={account}
          onChange={(e) => setAccount(e.target.value)}
          placeholder="Tài khoản"
          required
          className="p-2 border rounded"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mật khẩu"
          required
          className="p-2 border rounded"
        />
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
          Đăng nhập
        </button>
        <button onClick={handleRegister} className="bg-blue-500 text-white py-2 px-4 rounded">
          Đăng ký
        </button>
      </form>
    </div>
  );
};

export default LoginPage;