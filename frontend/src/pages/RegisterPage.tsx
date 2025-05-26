import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/register', { account, password });
      alert('Đăng ký thành công!');
      navigate('/login');
    } catch (err) {
      alert('Đăng ký thất bại.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 shadow-md border rounded">
      <h2 className="text-2xl font-bold mb-4">Đăng ký</h2>
      <form onSubmit={handleRegister} className="flex flex-col gap-4">
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
        <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded">
          Đăng ký
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;