import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../provider/AuthProvider';
import { Types } from 'mongoose';

interface Props {
  chatId: Types.ObjectId;
  chatKey: Buffer
}

const MessageInput = ({ chatId, chatKey }: Props) => {
  const [message, setMessage] = useState('');
  const {user} = useAuth();

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user) return;

    try {
      await axios.post(
        'http://localhost:3000/message/add-message',
        { chatId, sender: user._id, type: 'text', content: message, chatKey },
        { withCredentials: true }
      );
      setMessage('');
    } catch (err) {
      console.error('Lỗi khi gửi tin nhắn:', err);
    }
  };

  return (
    <form onSubmit={handleSend} className="flex gap-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Nhập tin nhắn..."
        className="flex-1 p-2 border rounded"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Gửi
      </button>
    </form>
  );
};

export default MessageInput;