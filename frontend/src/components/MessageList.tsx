import { useEffect } from 'react';
import axios from 'axios';
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
  chatKey: Buffer;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const MessageList = ({ chatId, chatKey, messages, setMessages }: Props) => {
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.post('http://localhost:3000/message/get-message-chat', 
        {chatId, chatKey},
        {withCredentials: true,});
        setMessages(res.data.data);
      } catch (err) {
        console.error('Lỗi khi tải tin nhắn:', err);
      }
    };

    if (chatId) {
      fetchMessages();
    }
  }, [chatId, chatKey, setMessages]);

  return (
    <div className="h-full p-4 overflow-y-auto space-y-2">
      {messages.map((msg) => (
        <div key={msg._id.toString()} className="p-2 bg-gray-100 rounded shadow">
          <div className="text-sm text-gray-600">{msg.sender.name}</div>
          {msg.type === 'text' ? (
            <div className="text-base">{msg.content}</div>
          ) : (
            <div className="text-base">{msg.fileName}</div>
          )}
          <div className="text-xs text-gray-400 text-right">{new Date(msg.time).toLocaleTimeString()}</div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
