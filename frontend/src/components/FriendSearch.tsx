import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../provider/AuthProvider';
import { Types } from 'mongoose';

interface SearchResult {
  _id: Types.ObjectId;
  account: string;
  name: string;
  avatar?: {
    data: Buffer;
    mimetype: string;
  };
}

const FriendSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const { user } = useAuth();
  const friendIds = user?.friendList.map(f => f.toString()) || [];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.get(`http://localhost:3000/user/search?q=${query}`, {
        withCredentials: true,
      });
      setResults(res.data.results);
    } catch (err) {
      console.error('Lỗi tìm kiếm:', err);
    }
  };

  const handleAddFriend = async (friendId: Types.ObjectId) => {
    try {
      await axios.post(
        'http://localhost:3000/friend/send-request',
        {
          fromUser: user?._id,
          toUser: friendId,
        },
        { withCredentials: true }
      );
      alert('Đã gửi yêu cầu kết bạn!');
    } catch (err) {
      console.error('Lỗi khi gửi yêu cầu kết bạn:', err);
    }
  };

  return (
    <div className="my-4">
      <form onSubmit={handleSearch} className="flex mb-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm kiếm bạn bè"
          className="flex-1 p-2 border rounded-l"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 rounded-r">
          Tìm
        </button>
      </form>
      
      {results.map((friend) => {
      const isFriend = friendIds.includes(friend._id.toString());
      return (
        <div
          key={friend._id.toString()}
          className="flex justify-between items-center p-2 border rounded mb-1"
        >
          <span>{friend.name}</span>

          {!isFriend && (
            <button
              onClick={() => handleAddFriend(friend._id)}
              className="text-sm text-blue-600 hover:underline"
            >
              Kết bạn
            </button>
          )}
        </div>
      );
    })}
    </div>
  );
};

export default FriendSearch;