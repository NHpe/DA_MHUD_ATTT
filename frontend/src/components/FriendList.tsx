import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../provider/AuthProvider';
import { Types } from 'mongoose';

interface Friend {
  _id: Types.ObjectId;
  account: string;
  name: string;
  avatar?: {
    data: Buffer;
    mimetype: string;
  };
}

const FriendList = () => {
  const { user } = useAuth();
  const [friends, setFriends] = useState<Friend[]>([]);

  const handleUnfriend = async (friendId: Types.ObjectId) => {
    try {
      await axios.post(
        'http://localhost:3000/friend/unfriend',
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

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await axios.post(
          'http://localhost:3000/user/get-friend-data',
          { friendList: user?.friendList },
          { withCredentials: true }
        );
        setFriends(res.data.data);
      } catch (err) {
        console.error('Lỗi khi tải danh sách bạn bè:', err);
      }
    };

    if (user?._id) {
      fetchFriends();
    }
  }, [user]);

  return (
    <div className="mt-2">
      {friends.map((friend) => (
        <div key={friend._id.toString()} className="p-2 border rounded mb-1">
          <p className="font-semibold">{friend.name || friend.account}</p>
          <button
            onClick={() => handleUnfriend(friend._id)}
            className="text-sm text-blue-600 hover:underline"
          >
            Hủy kết bạn
          </button>
        </div>
      ))}
    </div>
  );
};

export default FriendList;