import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../provider/AuthProvider';
import { Types } from 'mongoose';

interface Chat {
  _id: Types.ObjectId;
  name?: string;
  participantList: Types.ObjectId[];
  chatKey: Buffer;
  type: 'single' | 'group';
}

const ChatList = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.post('http://localhost:3000/chat/get-chat-list', {
          withCredentials: true,
          chatList: user?.chatList
        });
        setChats(res.data.chats);
      } catch (err) {
        console.error('Lỗi khi tải danh sách cuộc trò chuyện:', err);
      }
    };

    if (user?._id) {
      fetchChats();
    }
  }, [user]);

  const handleSelectChat = (chatId: Types.ObjectId) => {
    navigate(`/chat/${chatId}`);
  };

  return (
    <div className="flex flex-col gap-2">
      {chats.map((chat) => (
        <button
          key={chat._id.toString()}
          onClick={() => handleSelectChat(chat._id)}
          className="text-left p-2 border rounded hover:bg-gray-100"
        >
          {chat.name ? chat.name : `Cuộc trò chuyện`}
        </button>
      ))}
    </div>
  );
};

export default ChatList;