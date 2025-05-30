import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Types } from "mongoose";
import { PropsWithChildren } from "react";

// User data thay vì token
interface User {
    _id: Types.ObjectId;
    account: string;
    name: string;
    friendList: {
      type: Types.ObjectId,
      ref: 'User'}[];
    chatList: {
      type: Types.ObjectId,
      ref: 'Chat'}[];
    avatar?: {
      data: Buffer,
      mimetype: string
    }
};

interface AuthContextType {
    user: User | null; // Dữ liệu người dùng
    setUser: (user: User | null) => void; // Hàm cập nhật người dùng
    refreshUser: () => void,
    logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {}, // placeholder function
  refreshUser: () => {},
  logout: () => {}
});

const AuthProvider = ({ children }: PropsWithChildren<{}>) => {
  const [user, setUser] = useState<User | null>(null);    
  const [loading, setLoading] = useState(true);

  // Gọi API để xác thực từ cookie JWT
  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:3000/auth", {
        withCredentials: true, // Gửi kèm cookie JWT
      });
      setUser(res.data.user); // hoặc res.data tùy backend
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await axios.post('http://localhost:3000/auth/logout', {}, { withCredentials: true });
      setUser(null); 
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const contextValue = useMemo(
    () => ({
      user,
      setUser,
      loading,
      isAuthenticated: !!user,
      refreshUser: fetchUser,
      logout,
    }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;