import ChatList from "../components/sidebar/ChatList";

const HomePage = () => {
  return (
    <div className="flex h-screen">
      <aside className="w-1/3 border-r p-4">
        <h2 className="font-bold text-xl mb-2">Trò chuyện</h2>
        <ChatList />
        {/* <h2 className="font-bold text-xl mt-6 mb-2">Bạn bè</h2>
        <FriendSearch />
        <FriendList /> */}
      </aside>
      <main className="flex-1 flex items-center justify-center text-gray-500">
        <p>Chọn một cuộc trò chuyện để bắt đầu</p>
      </main>
    </div>
  );
};

export default HomePage;