import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../provider/AuthProvider';
import { Types } from 'mongoose';

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

interface Props {
  chatId: Types.ObjectId;
  chatKey: Buffer
  onSent: (message: Message) => void;
}

const MessageInput = ({ chatId, chatKey, onSent }: Props) => {
  const [message, setMessage] = useState('');
  const {user} = useAuth();

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user) return;

    try {
      const res = await axios.post(
        'http://localhost:3000/message/add-message',
        { chatId, sender: user._id, type: 'text', content: message, chatKey },
        { withCredentials: true }
      );

      const newMessage = res.data.data;

      const populatedMessage: Message = {
        ...newMessage,
        content: message, // override mã hóa bằng nội dung gốc vừa gửi
      };

      onSent(populatedMessage);
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