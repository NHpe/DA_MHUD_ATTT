import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../provider/AuthProvider";
import { Types } from "mongoose";
import ChatList from "../components/ChatList";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";
import FriendList from "../components/FriendList";
import PendingFriendList from "../components/PendingFriendList";
import ChatOption from "../components/ChatOption";
import FriendSearch from "../components/FriendSearch";

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
  const { user } = useAuth();
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showOptionSidebar, setShowOptionSidebar] = useState(false);
  const [showMainMenu, setShowMainMenu] = useState(false);
  const [activeSidebar, setActiveSidebar] = useState<'chat' | 'friends' | 'profile'>('chat');

  const handleChatClick = (chat : Chat) => {
    setSelectedChat(chat);
    setMessages([]);
    setShowOptionSidebar(false);
  };

  const handleStartNewChat = () => {
    navigate('/new-chat');
  };

  const handleMessageSent = (newMessage: Message) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const toggleMainMenu = () => setShowMainMenu((prev) => ! prev);

  return (
    <div className="flex h-screen">
      {/* Sidebar trái: Danh sách trò chuyện hoặc menu phụ */}
      <aside className="w-1/4 border-r p-4 flex flex-col relative">
        <div className="flex justify-between items-center mb-4">
          <button onClick={toggleMainMenu} className="text-sm px-2 py-1 bg-gray-200 rounded">☰</button>
          <h2 className="text-lg font-bold">Trò chuyện</h2>
          <button onClick={handleStartNewChat} className="text-sm px-2 py-1 bg-green-500 text-white rounded">+ Tạo</button>
        </div>

        {showMainMenu && (
          <div className="mb-4 space-y-2">
            <button onClick={() => setActiveSidebar('friends')} className="block w-full text-left hover:underline">Bạn bè</button>
            <button onClick={() => setActiveSidebar('profile')} className="block w-full text-left hover:underline">Thông tin cá nhân</button>
          </div>
        )}

        {activeSidebar === 'chat' && <ChatList onSelectChat={handleChatClick} />}
        {activeSidebar !== 'chat' && (
          <div>
            <button onClick={() => setActiveSidebar('chat')} className="mb-4 text-sm text-blue-500 hover:underline">← Quay lại danh sách trò chuyện</button>
            <div className="space-y-2">
              {activeSidebar === 'friends' && (
                <>
                  <FriendSearch />
                  <h3 className="font-semibold">Danh sách lời mời kết bạn hiện có</h3>
                  <PendingFriendList />
                  <h3 className="font-semibold">Danh sách bạn bè hiện tại</h3>
                  <FriendList />
                </>
              )}
              {/* {activeSidebar === 'profile' && user && <ProfileCard user={user} />} */}
            </div>
          </div>
        )}
      </aside>

      {/* Nội dung chính: Tin nhắn */}
      <main className="flex-1 flex flex-col relative">
        {!selectedChat ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Chọn một cuộc trò chuyện để bắt đầu
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center p-2 border-b">
              <h3 className="font-semibold">Đoạn chat: {selectedChat.name}</h3>
              <button onClick={() => setShowOptionSidebar(true)} className="text-sm px-2 py-1 bg-gray-200 rounded">
                ⚙ Tuỳ chọn
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <MessageList chatId={selectedChat._id} chatKey={selectedChat.chatKey} messages={messages} setMessages={setMessages} />
            </div>
            <div className="border-t p-4">
              <MessageInput chatId={selectedChat._id} chatKey={selectedChat.chatKey} onSent={handleMessageSent} />
            </div>
          </>
        )}
      </main>

      {/* Sidebar phải: Tùy chọn đoạn chat */}
      {showOptionSidebar && selectedChat && (
        <aside className="w-1/4 border-l p-4 overflow-y-auto">
          <button onClick={() => setShowOptionSidebar(false)} className="mb-4 text-sm text-blue-500 hover:underline">← Quay lại đoạn chat</button>
          <ChatOption chatId={selectedChat._id} participantList={selectedChat.participantList} onClose={() => setShowOptionSidebar(false)} />
        </aside>
      )}
    </div>
  );
};

export default HomePage;