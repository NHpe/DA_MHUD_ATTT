import FriendList from "../components/FriendList";
import FriendSearch from "../components/FriendSearch";
import PendingFriendList from "../components/PendingFriendList";

const FriendsPage = () => {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Quản lý bạn bè</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Tìm kiếm bạn bè</h2>
        <FriendSearch />
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Yêu cầu kết bạn đang chờ</h2>
        <PendingFriendList />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Danh sách bạn bè</h2>
        <FriendList />
      </section>
    </div>
  );
};

export default FriendsPage;
