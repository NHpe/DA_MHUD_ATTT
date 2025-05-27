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

const PendingFriendList = () => {
  const { user } = useAuth();
  const [friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await axios.post(
          'http://localhost:3000/friend/get-friend-request',
          { userID: user?._id },
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

  const handleAcceptFriend = async (friendId: string) => {
    try {
      await axios.post(
        'http://localhost:3000/friend/accept-request',
        { fromUser: new Types.ObjectId(friendId), toUser: user?._id,  },
        { withCredentials: true }
      );
      setFriends((prev) => prev.filter((friend) => friend._id.toString() !== friendId));
      alert('Đã chấp nhận lời mời kết bạn!');
    } catch (err) {
      console.error('Lỗi khi chấp nhận lời mời kết bạn:', err);
    }
  }

  const handleRejectFriend = async (friendId: string) => {
    try {
      await axios.post(
        'http://localhost:3000/friend/reject-request',
        { fromUser: new Types.ObjectId(friendId), toUser: user?._id },
        { withCredentials: true }
      );
      setFriends((prev) => prev.filter((friend) => friend._id.toString() !== friendId));
      alert('Đã từ chối lời mời kết bạn!');
    } catch (err) {
      console.error('Lỗi khi từ chối lời mời kết bạn:', err);
    }
  };

  return (
    <div className="mt-2">
      {friends.map((friend) => (
        <div key={friend._id.toString()} className="p-2 border rounded mb-1">
          <p className="font-semibold">{friend.name || friend.account}</p>
          <button
            onClick={() => handleAcceptFriend(friend._id.toString())}
            className="text-sm text-blue-600 hover:underline"
          >
            Chấp nhận
          </button>
          <button
            onClick={() => handleRejectFriend(friend._id.toString())}
            className="text-sm text-blue-600 hover:underline"
          >
            Từ chối
          </button>
        </div>
      ))}
    </div>
  );
};

export default PendingFriendList;