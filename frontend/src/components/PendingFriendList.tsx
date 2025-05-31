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

const getAvatarUrl = (avatar?: { data: any; mimetype: string }) => {
  const avatarUrl = avatar?.data
    ? `data:${avatar.mimetype};base64,${Buffer.from(avatar.data).toString('base64')}`
    : null;
  return avatarUrl;
};

interface PendingFriendListProps {
  onFriendAccepted: (friend: Friend) => void;
}

const PendingFriendList = ({onFriendAccepted} : PendingFriendListProps) => {
  const { user, refreshUser } = useAuth();
  const [friends, setFriends] = useState<Friend[]>([]);

  const fetchFriends = async () => {
    if (!user?._id) return;
    try {
      const res = await axios.post(
        'http://localhost:3000/friend/get-friend-request',
        { userId: user._id },
        { withCredentials: true }
      );
      const formattedFriends: Friend[] = res.data.data.map((f: any) => f.fromUser);
      setFriends(formattedFriends);
    } catch (err) {
      console.error('Lỗi khi tải danh sách bạn bè:', err);
    } 
  };

  useEffect(() => {
    const fetchFriends = async () => {
      if (!user?._id) return;
      try {
        const res = await axios.post(
          'http://localhost:3000/friend/get-friend-request',
          { userId: user._id },
          { withCredentials: true }
        );
        const formattedFriends: Friend[] = res.data.data.map((f: any) => f.fromUser);
        setFriends(formattedFriends);
      } catch (err) {
        console.error('Lỗi khi tải danh sách bạn bè:', err);
      } 
    };
    fetchFriends();
  }, [user]);

  const handleAcceptFriend = async (friendId: Types.ObjectId) => {
    try {
      await axios.post(
        'http://localhost:3000/friend/accept-request',
        { fromUser: friendId, toUser: user?._id,  },
        { withCredentials: true }
      );

      await refreshUser();

      const acceptedFriend = friends.find(f => f._id === friendId);
      if (acceptedFriend) {
        onFriendAccepted(acceptedFriend);
      }

      setFriends((prev) => prev.filter((friend) => friend._id !== friendId));
      fetchFriends();
    } catch (err) {
      console.error('Lỗi khi chấp nhận lời mời kết bạn:', err);
    }
  }

  const handleRejectFriend = async (friendId: Types.ObjectId) => {
    try {
      await axios.post(
        'http://localhost:3000/friend/reject-request',
        { fromUser: new Types.ObjectId(friendId), toUser: user?._id },
        { withCredentials: true }
      );

      await refreshUser();

      setFriends((prev) => prev.filter((friend) => friend._id !== friendId));
      fetchFriends();
    } catch (err) {
      console.error('Lỗi khi từ chối lời mời kết bạn:', err);
    }
  };

  return (
    <div className="mt-2">
      {friends.length === 0 ? (
        <p className="text-sm text-gray-500">Không có lời mời kết bạn nào.</p>
      ) : (
        friends.map((friend) => {
          const avatarUrl = getAvatarUrl(friend.avatar);
          return (
            <div key={friend._id.toString()} className="p-2 border rounded mb-2 flex items-center space-x-4">
              <img
                src={avatarUrl || '/default-avatar.png'}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="font-semibold">{friend.name}</p>
                <div className="space-x-4 mt-1">
                  <button
                    onClick={() => handleAcceptFriend(friend._id)}
                    className="text-sm text-green-600 hover:underline"
                  >
                    Chấp nhận
                  </button>
                  <button
                    onClick={() => handleRejectFriend(friend._id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Từ chối
                  </button>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default PendingFriendList;