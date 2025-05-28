import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../provider/AuthProvider';
import { Types } from 'mongoose';

interface User {
  _id: Types.ObjectId;
  account: string;
  name: string;
  avatar?: {
    data: Buffer;
    mimetype: string;
  };
}

const NewChatPage = () => {
  const { user, refreshUser } = useAuth();
  const [chatName, setChatName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  const toggleSelect = (userSelected: User) => {
    setSelectedUsers(prev =>
      prev.some(u => u._id.toString() === userSelected._id.toString())
        ? prev.filter(u => u._id.toString() !== userSelected._id.toString())
        : [...prev, userSelected]
    );
  };

  const handleCreateChat = async () => {
    try {
      await axios.post('http://localhost:3000/chat/create', {
          name: chatName,
          participantList: [user?._id, ...selectedUsers.map(u => u._id)],
        },
        { withCredentials: true }
      );
      refreshUser();
      navigate('/');
    } catch (err) {
      console.error('Lỗi khi tạo cuộc trò chuyện:', err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Tạo cuộc trò chuyện mới</h1>

      <input
        type="text"
        value={chatName}
        onChange={(e) => setChatName(e.target.value)}
        placeholder="Tên cuộc trò chuyện"
        className="w-full p-2 border rounded"
      />

      <div>
        <h2 className="text-lg font-semibold mb-2">Chọn bạn bè</h2>
        <FriendListSelector selected={selectedUsers} toggleSelect={toggleSelect} />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Tìm người khác</h2>
        <FriendSearchSelector selected={selectedUsers} toggleSelect={toggleSelect} />
      </div>

      <button
        onClick={handleCreateChat}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Tạo cuộc trò chuyện
      </button>
    </div>
  );
};

const FriendListSelector = ({ selected, toggleSelect }: {
  selected: User[];
  toggleSelect: (selectedUser: User) => void;
}) => {
  const { user } = useAuth();
  const [friends, setFriends] = useState<User[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.post(
        'http://localhost:3000/user/get-friend-data',
        { friendList: user?.friendList },
        { withCredentials: true }
      );
      setFriends(res.data.data);
    };
    if (user) fetch();
  }, [user]);

  return (
    <div className="space-y-1">
      {friends.map((u) => (
        <label key={u._id.toString()} className="block">
          <input
            type="checkbox"
            checked={selected.some(sel => sel._id.toString() === u._id.toString())}
            onChange={() => toggleSelect(u)}
            className="mr-2"
          />
          {u.name || u.account}
        </label>
      ))}
    </div>
  );
};

const FriendSearchSelector = ({ selected, toggleSelect }: {
  selected: User[];
  toggleSelect: (selectedUser: User) => void;
}) => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<User[]>([]);

  const handleSearch = async () => {
    const res = await axios.get(`http://localhost:3000/user/search?q=${search}`, {
      withCredentials: true,
    });
    setResults(res.data.results);
  };

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm theo tên hoặc tài khoản"
          className="flex-1 p-2 border rounded"
        />
        <button onClick={handleSearch} className="px-4 py-2 bg-blue-500 text-white rounded">
          Tìm
        </button>
      </div>
      <div className="space-y-1">
        {results.map((u) => (
          <label key={u._id.toString()} className="block">
            <input
              type="checkbox"
              checked={selected.includes(u)}
              onChange={() => toggleSelect(u)}
              className="mr-2"
            />
            {u.name || u.account}
          </label>
        ))}
      </div>
    </div>
  );
};

export default NewChatPage;