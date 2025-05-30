import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../provider/AuthProvider';
import { Types } from 'mongoose';

interface User {
  _id: Types.ObjectId;
  account: string;
  name: string;
  avatar?: { data: Buffer; mimetype: string };
}

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

const NewChat = ({ onClose, onCreated }: Props) => {
  const { user, refreshUser } = useAuth();
  const [chatName, setChatName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

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
      }, { withCredentials: true });

      refreshUser();
      onCreated();
      onClose();
    } catch (err) {
      console.error('Lỗi khi tạo cuộc trò chuyện:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-xl space-y-4 relative">
        <button onClick={onClose} className="absolute right-2 top-2 text-gray-500">✖</button>
        <h1 className="text-2xl font-bold">Tạo cuộc trò chuyện mới</h1>

        <input
          type="text"
          value={chatName}
          onChange={(e) => setChatName(e.target.value)}
          placeholder="Tên cuộc trò chuyện"
          className="w-full p-2 border rounded"
        />

        <FriendListSelector selected={selectedUsers} toggleSelect={toggleSelect} />
        <FriendSearchSelector selected={selectedUsers} toggleSelect={toggleSelect} />

        <button
          onClick={handleCreateChat}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Tạo cuộc trò chuyện
        </button>
      </div>
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
      const res = await axios.post('http://localhost:3000/user/get-users-data',
        { userList: user?.friendList },
        { withCredentials: true }
      );
      setFriends(res.data.data);
    };
    if (user) fetch();
  }, [user]);

  return (
    <div>
      <h2 className="text-lg font-semibold mt-4 mb-2">Chọn bạn bè</h2>
      <div className="space-y-1 max-h-40 overflow-y-auto">
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
    </div>
  );
};

const FriendSearchSelector = ({ selected, toggleSelect }: {
  selected: User[]; toggleSelect: (selectedUser: User) => void;
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
      <h2 className="text-lg font-semibold mt-4 mb-2">Tìm người khác</h2>
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
      <div className="space-y-1 max-h-40 overflow-y-auto">
        {results.map((u) => (
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
    </div>
  );
};

export default NewChat;