import { useAuth } from "../provider/AuthProvider";
import { useState } from 'react';
import axios from 'axios';

const ProfileUser = () => {
  const {user, refreshUser} = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  if (!user) return null;

  const avatarUrl = user.avatar?.data
    ? `data:${user.avatar.mimetype};base64,${Buffer.from(user.avatar.data).toString('base64')}`
    : null;

  const handleNameChange = async () => {
    try {
      await axios.post('http://localhost:3000/user/change-user-name', { newName: name, userId: user._id }, { withCredentials: true });
      refreshUser();
    } catch (err) {
      console.error('Lỗi đổi tên:', err);
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;
    const formData = new FormData();
    formData.append('avatar', avatarFile);

    try {
      await axios.post('http://localhost:3000/user/upload-avatar', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      refreshUser();
    } catch (err) {
      console.error('Lỗi upload avatar:', err);
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) return;
    try {
      const res = await axios.post('http://localhost:3000/user/change-password', {
        userId: user._id,
        oldPassword,
        newPassword,
      }, { withCredentials: true });

      setOldPassword('');
      setNewPassword('');
      setShowPasswordFields(false);
      if (res.status === 200)
        alert('Đổi mật khẩu thành công');
      else 
        alert('Đổi mật khẩu thất bại');
    } catch (err) {
      console.error('Lỗi đổi mật khẩu:', err);
      alert('Đổi mật khẩu thất bại');
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-2">Thông tin cá nhân</h2>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="avatar"
          className="w-24 h-24 rounded-full object-cover mb-3"
        />
      ) : (
        <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center mb-3">
          <span className="text-gray-600">No Avatar</span>
        </div>
      )}
      <div className="space-y-2">
        <label className="block">
          <span className="text-sm font-medium">Tên</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-1 rounded mt-1"
          />
        </label>
        <button
          onClick={handleNameChange}
          className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
        >
          Đổi tên
        </button>
      </div>

      <div className="space-y-2">
        <label className="block">
          <span className="text-sm font-medium">Ảnh đại diện</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
            className="mt-1"
          />
        </label>
        <button
          onClick={handleAvatarUpload}
          className="px-3 py-1 bg-green-600 text-white rounded text-sm"
        >
          Đổi ảnh đại diện
        </button>
      </div>

      <p><strong>Tài khoản:</strong> {user.account}</p>

      <div className="space-y-2 pt-4">
        {!showPasswordFields ? (
          <button
            onClick={() => setShowPasswordFields(true)}
            className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
          >
            Đổi mật khẩu
          </button>
        ) : (
          <div className="space-y-2">
            <label className="block">
              <span className="text-sm font-medium">Mật khẩu cũ</span>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full border p-1 rounded mt-1"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Mật khẩu mới</span>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border p-1 rounded mt-1"
              />
            </label>
            <div className="flex gap-2">
              <button
                onClick={handleChangePassword}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm"
              >
                Xác nhận
              </button>
              <button
                onClick={() => setShowPasswordFields(false)}
                className="px-3 py-1 bg-gray-300 text-black rounded text-sm"
              >
                Hủy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileUser;