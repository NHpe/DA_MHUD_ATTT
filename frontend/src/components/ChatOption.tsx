import { useEffect, useState } from 'react';
import axios from 'axios';
import { Types } from 'mongoose';
import { useAuth } from '../provider/AuthProvider';

interface User {
  _id: Types.ObjectId;
  account: string;
  name: string;
  avatar?: {
    data: Buffer;
    mimetype: string;
  };
}

interface Props {
  chatId: Types.ObjectId;
  participantList: Types.ObjectId[];
  onClose: () => void
}

const ChatOption = ({chatId, participantList, onClose} : Props) => {
  const [members, setMembers] = useState<User[]>([]);
  const [newName, setNewName] = useState('');
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<Types.ObjectId>();
  const {user} = useAuth();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await axios.post(
          'http://localhost:3000/user/get-users-data',
          { userList: participantList },
          { withCredentials: true }
        );
        setMembers(res.data.data);
      } catch (err) {
        console.error('Lỗi khi tải danh sách thành viên:', err);
      }
    };
    fetchMembers();
  }, [participantList]);

  const renameChat = async () => {
    try {
      await axios.post(`http://localhost:3000/chat/change-chat-name`, { chatId, newName }, { withCredentials: true });
      alert('Đã đổi tên');
    } catch (err) {
      console.error(err);
    }
  };

  const addMember = async () => {
    try {
      await axios.post(`http://localhost:3000/chat/add-participant`, { chatId, participant: selectedUserId }, { withCredentials: true });
      alert('Đã thêm thành viên');
    } catch (err) {
      console.error(err);
    }
  };

  const removeMember = async () => {
    try {
      await axios.post(`http://localhost:3000/chat/remove-participant`, { chatId, participant: selectedUserId }, { withCredentials: true });
      alert('Đã xoá thành viên');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/user/search?q=${search}`, {
        withCredentials: true,
      });
      setSearchResults(res.data.results);
    } catch (err) {
      console.error('Lỗi tìm kiếm người dùng:', err);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow max-w-md mx-auto space-y-4">
      <h2 className="text-xl font-bold">Tùy chọn cuộc trò chuyện</h2>

      <div>
        <h3 className="font-semibold">Đổi tên</h3>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Tên mới"
          className="w-full border p-2 rounded"
        />
        <button onClick={renameChat} className="mt-2 px-3 py-1 bg-blue-600 text-white rounded">
          Đổi tên
        </button>
      </div>

      <div>
        <h3 className="font-semibold">Thêm thành viên mới</h3>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên"
            className="flex-1 p-2 border rounded"
          />
          <button onClick={handleSearch} className="px-3 py-1 bg-blue-500 text-white rounded">
            Tìm
          </button>
        </div>
        <div className="space-y-1">
          {searchResults.map((user) => (
            <label key={user._id.toString()} className="block">
              <input
                type="radio"
                name="selectUser"
                checked={selectedUserId === user._id}
                onChange={() => setSelectedUserId(user._id)}
                className="mr-2"
              />
              {user.name}
            </label>
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          <button onClick={addMember} className="px-3 py-1 bg-green-600 text-white rounded">
            Thêm
          </button>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-1">Thành viên hiện tại</h3>
        <ul className="list-disc pl-4 mb-2">
          {members.map((m) => (
            <li key={m._id.toString()} className="flex justify-between items-center">
              <span>{m.name}</span>
              {user?._id !== m._id && (
                <button
                  onClick={() => {
                    setSelectedUserId(m._id);
                    removeMember();
                  }}
                  className="text-sm text-red-600 hover:underline"
                >
                  Xoá
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      <button onClick={onClose} className="mt-4 px-3 py-1 bg-gray-300 rounded">
        Đóng
      </button>
    </div>
  );
};

export default ChatOption;