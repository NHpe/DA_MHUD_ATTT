import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../provider/AuthProvider';
import { Types } from 'mongoose';

interface Chat {
  _id: Types.ObjectId;
  name?: string;
  participantList: Types.ObjectId[];
  chatKey: Buffer;
  type: 'single' | 'group';
}


interface ChatListProps {
  onSelectChat: (chat: Chat) => void;
}

const ChatList: React.FC<ChatListProps> = ({ onSelectChat }) => {
  // component logic
  const [chats, setChats] = useState<Chat[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.post('http://localhost:3000/chat/get-chat-list', 
          {chatList: user?.chatList}, 
          {withCredentials: true},);
        setChats(res.data.chats);
      } catch (err) {
        console.error('Lỗi khi tải danh sách cuộc trò chuyện:', err);
      }
    };

    if (user?._id) {
      fetchChats();
    }
  }, [user]);

  return (
    <div>
      {chats.map((chat) => (
        <button key={chat._id.toString()}
          onClick={() => onSelectChat(chat)}
        >
          {chat.name}
        </button>
      ))}
    </div>
  );
};

export default ChatList;