import { useEffect } from 'react';
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

const getAvatarUrl = (avatar?: { data: any; mimetype: string }) => {
  const avatarUrl = avatar?.data
    ? `data:${avatar.mimetype};base64,${Buffer.from(avatar.data).toString('base64')}`
    : null;
  return avatarUrl;
};

interface FriendListProps {
  friends: Friend[]
  setFriends: React.Dispatch<React.SetStateAction<Friend[]>>;
}

const FriendList = ({friends, setFriends} : FriendListProps) => {
  const { user, refreshUser } = useAuth();

  const fetchFriends = async () => {
      try {
        const res = await axios.post(
          'http://localhost:3000/user/get-users-data',
          { userList: user?.friendList },
          { withCredentials: true }
        );
        setFriends(res.data.data);
      } catch (err) {
        console.error('Lỗi khi tải danh sách bạn bè:', err);
      }
    };

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await axios.post(
          'http://localhost:3000/user/get-users-data',
          { userList: user?.friendList },
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
  }, [user, setFriends]);

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
      await refreshUser();
      fetchFriends();
    } catch (err) {
      console.error('Lỗi khi gửi yêu cầu kết bạn:', err);
    }
  };

  return (
    <div className="mt-2">
      {friends.map((friend) => {
        const avatarUrl = getAvatarUrl(friend.avatar);
        return (
          <div key={friend._id.toString()} className="p-2 border rounded mb-1">
            {/* Uncomment below to show avatar if needed */}
            {avatarUrl && (
              <img src={avatarUrl} alt={`${friend.name}'s avatar`} className="w-8 h-8 rounded-full mb-2" />
            )} 
            <p className="font-semibold">{friend.name}</p>
            <button
              onClick={() => handleUnfriend(friend._id)}
              className="text-sm text-blue-600 hover:underline"
            >
              Hủy kết bạn
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default FriendList;