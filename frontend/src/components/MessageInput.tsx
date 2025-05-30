import { useState, useEffect } from 'react';
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
  editingMessage: Message | null;
  setEditingMessage: (msg: Message | null) => void;
}

const MessageInput = ({ chatId, chatKey, onSent, editingMessage, setEditingMessage }: Props) => {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const {user} = useAuth();

  useEffect(() => {
    if (editingMessage) {
      setText(editingMessage.content || '');
    }
  }, [editingMessage]);

  const handleSend = async (e: React.FormEvent) => {
    if (!user || (!text.trim() && !file)) return;

    const base64Key = Buffer.from(chatKey).toString('base64');

    try {
      if (editingMessage) {
        await axios.post(
          'http://localhost:3000/message/edit-message',
          {
            messageId: editingMessage._id,
            newContent: text,
            chatKey: base64Key,
          },
          { withCredentials: true }
        );

        onSent({ ...editingMessage, content: text });
        setEditingMessage(null);
        setText('');
        setFile(null);
        return;
      }

      if (file) {
        const formData = new FormData();
        formData.append('chatId', chatId.toString());
        formData.append('sender', user._id.toString());
        formData.append('chatKey', base64Key);
        formData.append('type', 'file');
        formData.append('file', file);

        const res = await axios.post('http://localhost:3000/message/add-message', formData, {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        const newMessage = res.data.data;
        onSent({ ...newMessage });
      }

      if (text.trim()) {
        const formData = new FormData();
        formData.append('chatId', chatId.toString());
        formData.append('sender', user._id.toString());
        formData.append('chatKey', base64Key);
        formData.append('type', 'text');
        formData.append('content', text);

        const res = await axios.post('http://localhost:3000/message/add-message', formData, {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        const newMessage = res.data.data;
        onSent({ ...newMessage, content: text });
      }
      setText('');
      setFile(null);
    } catch (err) {
      console.error('Lỗi khi gửi tin nhắn:', err);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <textarea
        rows={2}
        className="w-full border rounded p-2 text-sm"
        placeholder="Nhập tin nhắn..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex items-center justify-between gap-2">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="text-sm"
        />
        <button
          onClick={handleSend}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
        >
          Gửi
        </button>
      </div>
    </div>
  );
};

export default MessageInput;