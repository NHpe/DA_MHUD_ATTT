import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ChatList from "../components/ChatList";
import { Types } from "mongoose";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";

interface Chat {
  _id: Types.ObjectId;
  name?: string;
  participantList: Types.ObjectId[];
  chatKey: Buffer;
  type: 'single' | 'group';
}

interface Message {
    _id: Types.ObjectId;
    chatId: Types.ObjectId;
    sender: {
      _id: Types.ObjectId;
      name: string;
    }
    type: 'text' | 'file';
    content?: string;
    fileId?: Types.ObjectId;
    fileName? : string;
    mimeType? : string;
    iv: Buffer;
    time: Date;
}

const HomePage = () => {
  const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const handleChatClick = (chat : Chat) => {
    setSelectedChat(chat);
    setMessages([]);
  };

  const handleStartNewChat = () => {
    navigate('/new-chat');
  };

  const handleMessageSent = (newMessage: Message) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  return (
    <div className="flex h-screen">
      <aside className="w-1/3 border-r p-4 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Danh sách trò chuyện</h2>
          <button
            onClick={handleStartNewChat}
            className="bg-green-500 text-white px-3 py-1 rounded text-sm"
          >
            + Mới
          </button>
        </div>
        <ChatList onSelectChat={handleChatClick} />
      </aside>

      <main className="flex-1 flex flex-col">
        {!selectedChat ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Chọn một cuộc trò chuyện để bắt đầu
          </div>
        ) : (
          <><div className="flex-1 flex items-center justify-center text-gray-500">
              {selectedChat.name}
            </div><>
            <div className="flex-1 overflow-y-auto">
              <MessageList chatId={selectedChat._id} chatKey={selectedChat.chatKey} messages={messages} setMessages={setMessages}/>
            </div>
            <div className="border-t p-4">
              <MessageInput chatId={selectedChat._id} chatKey={selectedChat.chatKey} onSent={handleMessageSent}/>
            </div>
          </></>
        )}
      </main>
    </div>
  );
};

export default HomePage;