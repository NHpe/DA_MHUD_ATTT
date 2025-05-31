import { useEffect, useState } from "react";
import { useAuth } from "../provider/AuthProvider";
import { Types } from "mongoose";
import ChatList from "../components/ChatList";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";
import FriendList from "../components/FriendList";
import PendingFriendList from "../components/PendingFriendList";
import ChatOption from "../components/ChatOption";
import FriendSearch from "../components/FriendSearch";
import ProfileUser from "../components/ProfileUser";
import NewChat from "../components/NewChat";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

interface Friend {
  _id: Types.ObjectId;
  account: string;
  name: string;
  avatar?: {
    data: Buffer;
    mimetype: string;
  };
}

const HomePage = () => {
  const { user, logout } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [friendList, setFriendList] = useState<Friend[]>([]);
  const [showOptionSidebar, setShowOptionSidebar] = useState(false);
  const [showMainMenu, setShowMainMenu] = useState(false);
  const [activeSidebar, setActiveSidebar] = useState<'chat' | 'friends' | 'profile' | 'create-chat'>('chat');
  const navigate = useNavigate();

  const refreshChatList = async () => {
    try {
      const res = await axios.post('http://localhost:3000/chat/get-chat-list', 
        {chatList: user?.chatList}, 
        {withCredentials: true},);
      setChats(res.data.chats);
      setSelectedChat(selectedChat);
    } catch (err) {
      console.error('Không thể load danh sách chat:', err);
    }
  };

  useEffect(() => {
    const refreshChatList = async () => {
      try {
        const res = await axios.post('http://localhost:3000/chat/get-chat-list', 
          {chatList: user?.chatList}, 
          {withCredentials: true},);
        setChats(res.data.chats);
      } catch (err) {
        console.error('Không thể load danh sách chat:', err);
      }
    };
    refreshChatList();
  }, [user?.chatList]);

  const handleChatClick = (chat : Chat) => {
    setSelectedChat(chat);
    setShowOptionSidebar(false);
  };

  const handleMessageSent = (newMessage: Message) => {
    setMessages((prevMessages) => {
      const index = prevMessages.findIndex(msg => msg._id.toString() === newMessage._id.toString());

      if (index !== -1) {
        // Nếu đã tồn tại -> chỉnh sửa
        const updated = [...prevMessages];
        updated[index] = newMessage;
        return updated;
      } else {
        // Nếu chưa tồn tại -> tin nhắn mới
        return [...prevMessages, newMessage];
      }
    });
  };

  const handleLogOut = async () => {
    await logout();
    navigate('/login'); // Chuyển về trang đăng nhập
  }

  const toggleMainMenu = () => setShowMainMenu((prev) => ! prev);

  const loadChat = async (chatId: Types.ObjectId) => {
    try {
      const res = await axios.post(`http://localhost:3000/chat/get-chat-infor`, {
        chatId
      },{
        withCredentials: true,
      });
      setSelectedChat(res.data.data);
    } catch (err) {
      console.error('Lỗi khi tải lại thông tin chat:', err);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar trái: Danh sách trò chuyện hoặc menu phụ */}
      <aside className="w-1/4 border-r p-4 flex flex-col relative">
        <div className="flex justify-between items-center mb-4">
          <button onClick={toggleMainMenu} className="text-sm px-2 py-1 bg-gray-200 rounded">☰</button>
          <h2 className="text-lg font-bold">Trò chuyện</h2>
        </div>

        {showMainMenu && (
          <div className="mb-4 space-y-2">
            <button onClick={() => setActiveSidebar('profile')} className="block w-full text-left hover:underline">Thông tin cá nhân</button>
            <button onClick={() => setActiveSidebar('friends')} className="block w-full text-left hover:underline">Bạn bè</button>
            <button onClick={() => setActiveSidebar('create-chat')} className="block w-full text-left hover:underline">Tạo cuộc trò chuyện mới</button>
            <button onClick={() => handleLogOut()} className="block w-full text-left hover:underline">Đăng xuất</button>
          </div>
        )}

        {activeSidebar === 'chat' && <ChatList onSelectChat={handleChatClick} chats={chats}/>}
        {activeSidebar !== 'chat' && (
          <div>
            <button onClick={() => setActiveSidebar('chat')} className="mb-4 text-sm text-blue-500 hover:underline">← Quay lại danh sách trò chuyện</button>
            <div className="space-y-2">
              {activeSidebar === 'friends' && (
                <>
                  <FriendSearch />
                  <h3 className="font-semibold">Danh sách lời mời kết bạn hiện có</h3>
                  <PendingFriendList onFriendAccepted={(newFriend) => setFriendList((prev) => [...prev, newFriend])} />
                  <h3 className="font-semibold">Danh sách bạn bè hiện tại</h3>
                  <FriendList friends={friendList} setFriends={setFriendList}/>
                </>
              )}
              {activeSidebar === 'profile' && user && <ProfileUser />}
              {activeSidebar === 'create-chat' && <NewChat/>}
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
              <MessageList chatId={selectedChat._id} chatKey={selectedChat.chatKey} messages={messages} setMessages={setMessages} setEditingMessage={setEditingMessage} />
            </div>
            <div className="border-t p-4">
              <MessageInput chatId={selectedChat._id} chatKey={selectedChat.chatKey} onSent={handleMessageSent} editingMessage={editingMessage} setEditingMessage={setEditingMessage}/>
            </div>
          </>
        )}
      </main>

      {/* Sidebar phải: Tùy chọn đoạn chat */}
      {showOptionSidebar && selectedChat && (
        <aside className="w-1/4 border-l p-4 overflow-y-auto">
          <button onClick={() => setShowOptionSidebar(false)} className="mb-4 text-sm text-blue-500 hover:underline">← Quay lại đoạn chat</button>
          <ChatOption chatId={selectedChat._id} participantList={selectedChat.participantList} refreshChat={() => loadChat(selectedChat._id)} refreshChatList={refreshChatList}/>
        </aside>
      )}
    </div>
  );
};

export default HomePage;