// src/components/Chat/MessageList.tsx
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Types } from 'mongoose';

interface Message {
  _id: Types.ObjectId;
  chatId: Types.ObjectId;
  sender: {
    _id: Types.ObjectId;
    name: string;
  };
  type: 'text' | 'file';
  content?: string;
  fileId?: Types.ObjectId;
  fileName?: string;
  mimeType?: string;
  iv: Buffer;
  time: Date;
}

interface Props {
  chatId: Types.ObjectId;
  chatKey: Buffer;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setEditingMessage: (msg: Message | null) => void;
}

const MessageList = ({ chatId, chatKey, messages, setMessages, setEditingMessage }: Props) => {
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    message: Message | null;
  }>({
    visible: false,
    x: 0,
    y: 0,
    message: null,
  });

  const contextMenuRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.post(
          'http://localhost:3000/message/get-message-chat',
          { chatId, chatKey },
          { withCredentials: true }
        );
        setMessages(res.data.data);
      } catch (err) {
        console.error('Lỗi khi tải tin nhắn:', err);
      }
    };

    if (chatId) {
      fetchMessages();
    }
  }, [chatId, chatKey, setMessages]);

  // Ẩn menu khi click ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(e.target as Node)
      ) {
        setContextMenu({ ...contextMenu, visible: false, message: null });
      }
    };

    if (contextMenu.visible) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [contextMenu]);

  const handleRightClick = (e: React.MouseEvent, msg: Message) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.pageX,
      y: e.pageY,
      message: msg,
    });
  };

  const handleEdit = () => {
    if (!contextMenu.message) return;
    setEditingMessage(contextMenu.message);
    setContextMenu({ ...contextMenu, visible: false, message: null });
  };

  const handleDelete = async () => {
    if (!contextMenu.message) return;

    const confirmed = window.confirm('Bạn có chắc muốn xóa tin nhắn này?');
    if (!confirmed) {
      setContextMenu({ ...contextMenu, visible: false, message: null });
      return;
    }

    try {
      await axios.post(
        `http://localhost:3000/message/remove-message`,
        { messageId: contextMenu.message._id },
        { withCredentials: true }
      );

      setMessages((prev) =>
        prev.filter((m) => m._id.toString() !== contextMenu.message?._id.toString())
      );
    } catch (err) {
      console.error('Xóa tin nhắn thất bại:', err);
    }

    setContextMenu({ ...contextMenu, visible: false, message: null });
  };

  const handleDownload = async () => {
    try {
      const res = await axios.post(`http://localhost:3000/message/download-file`, {
        fileId: contextMenu.message?.fileId,
        fileName: contextMenu.message?.fileName,
        mimeType: contextMenu.message?.mimeType,
        chatKey: Buffer.from(chatKey).toString('base64'),
        iv: contextMenu.message?.iv
      },{
        responseType: 'blob',
        withCredentials: true, // chắc chắn gửi fileId để tải file đúng
      });

      const blob = new Blob([res.data], { type: contextMenu.message?.mimeType || undefined });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', contextMenu.message?.fileName || 'file');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Không thể tải file:', err);
    }
  };

  return (
    <div className="h-full p-4 overflow-y-auto space-y-2 relative">
      {messages.map((msg) => (
        <div
          key={msg._id.toString()}
          onContextMenu={(e) => handleRightClick(e, msg)}
          className="p-2 bg-gray-100 rounded shadow cursor-pointer"
        >
          <div className="text-sm text-gray-600">{msg.sender.name}</div>
          {msg.type === 'text' ? (
            <div className="text-base whitespace-pre-wrap">{msg.content}</div>
          ) : (
            <div className="text-base text-blue-600 underline">{msg.fileName}</div>
          )}
          <div className="text-xs text-gray-400 text-right">
            {new Date(msg.time).toLocaleTimeString()}
          </div>
        </div>
      ))}

      {/* Context menu */}
      {contextMenu.visible && (
        <ul
          ref={contextMenuRef}
          style={{
            position: 'absolute',
            top: contextMenu.y,
            left: contextMenu.x,
            backgroundColor: 'white',
            border: '1px solid #ddd',
            padding: '4px 0',
            listStyle: 'none',
            zIndex: 1000,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            width: '140px',
            borderRadius: '4px',
          }}
        >
          {contextMenu.message?.type === 'text' && (
            <li
              onClick={handleEdit}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                userSelect: 'none',
              }}
              onMouseDown={(e) => e.preventDefault()} // prevent losing focus
            >
              Chỉnh sửa
            </li>
          )}
          {contextMenu.message?.type !== 'text' && (
            <li
              onClick={handleDownload}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                userSelect: 'none',
              }}
              onMouseDown={(e) => e.preventDefault()} // prevent losing focus
            >
              Tải xuống
            </li>
          )}
          <li
            onClick={handleDelete}
            style={{
              padding: '8px 12px',
              cursor: 'pointer',
              color: 'red',
              userSelect: 'none',
            }}
            onMouseDown={(e) => e.preventDefault()}
          >
            Xóa
          </li>
        </ul>
      )}
    </div>
  );
};

export default MessageList;