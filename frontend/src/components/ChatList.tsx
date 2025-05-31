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
  chats: Chat[]
}

const ChatList: React.FC<ChatListProps> = ({ onSelectChat, chats }) => {

  return (
    <div className="space-y-2">
      {chats.map((chat) => (
        <button
          key={chat._id.toString()}
          onClick={() => onSelectChat(chat)}
          className="w-full text-left p-2 border rounded hover:bg-gray-100"
        >
          {chat.name || 'Cuộc trò chuyện không tên'}
        </button>
      ))}
    </div>
  );
};

export default ChatList;