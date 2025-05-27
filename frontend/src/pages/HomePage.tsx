import { useNavigate } from "react-router-dom";
import ChatList from "../components/sidebar/ChatList";

const HomePage = () => {
  const navigate = useNavigate();

  const handleFriend = () => {
    navigate("/friends");
  };

  return (
    <div className="flex h-screen">
      <aside className="w-1/3 border-r p-4">
        <h2 className="font-bold text-xl mb-2">Trò chuyện</h2>
        <ChatList />
      </aside>
      <button onClick={handleFriend} className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded">
        Quản lý bạn bè
      </button>
      <main className="flex-1 flex items-center justify-center text-gray-500">
        <p>Chọn một cuộc trò chuyện để bắt đầu</p>
      </main>
    </div>
  );
};

export default HomePage;