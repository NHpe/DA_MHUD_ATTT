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
    avatar?: {
      data: Buffer,
      mimetype: string
    }
};

interface AuthContextType {
    user: User | null; // Dữ liệu người dùng
    setUser: (user: User | null) => void; // Hàm cập nhật người dùng
    token: string | null;
    setToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {}, // placeholder function
  token: null,
  setToken: () => {}, // placeholder function
});

const AuthProvider = ({ children }: PropsWithChildren<{}>) => {
  const [user, setUser] = useState<User | null>(null);    
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Gọi API để xác thực từ cookie JWT
  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:3000/auth/", {
        withCredentials: true, // Gửi kèm cookie JWT
      });
      setUser(res.data.user); // hoặc res.data tùy backend
      if (res.data.token) {
        setToken(res.data.token);
      }
    } catch (err) {
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      setUser,
      token,
      setToken,
      loading,
      isAuthenticated: !!user,
      refreshUser: fetchUser,
      //logout,
    }),
    [user, token, loading]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;