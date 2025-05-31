// src/components/Chat/MessageList.tsx
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Types } from 'mongoose';
import { useAuth } from '../provider/AuthProvider';

interface Message {
  _id: Types.ObjectId;
  chatId: Types.ObjectId;
  sender: {
    _id: Types.ObjectId;
    name: string;
    avatar?: {
      data: Buffer;
      mimetype: string;
    };
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

const getAvatarUrl = (avatar?: { data: any; mimetype: string }) => {
  const avatarUrl = avatar?.data
    ? `data:${avatar.mimetype};base64,${Buffer.from(avatar.data).toString('base64')}`
    : null;
  return avatarUrl;
};

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
  const {user} = useAuth();

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
    if (msg.sender._id.toString() !== user?._id.toString()) return;

    const menuWidth = 150;
    const menuHeight = 100;

    let x = e.clientX;
    let y = e.clientY;

    // Nếu menu bị tràn khỏi màn hình, điều chỉnh lại
    if (x + menuWidth > window.innerWidth) {
      x = window.innerWidth - menuWidth - 10;
    }

    if (y + menuHeight > window.innerHeight) {
      y = window.innerHeight - menuHeight - 10;
    }

    setContextMenu({
      visible: true,
      x,
      y,
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
      {messages.map((msg) => {
        const isOwnMessage = msg.sender._id === user?._id;
        return (
          <div
            key={msg._id.toString()}
            onContextMenu={(e) => handleRightClick(e, msg)}
            className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
          >
            {/* Avatar cho người khác */}
            {!isOwnMessage && (
              <div className="mr-2">
                {msg.sender.avatar ? (
                  // Nếu có avatar thật
                  <img
                    src={getAvatarUrl(msg.sender.avatar) || undefined}
                    alt={msg.sender.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  // Nếu không có avatar, dùng chữ cái đầu tên
                  <div className="w-8 h-8 rounded-full bg-blue-300 text-white flex items-center justify-center text-sm">
                    {msg.sender.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            )}

            <div
              className={`p-2 rounded shadow max-w-xs ${
                isOwnMessage ? 'bg-green-100' : 'bg-gray-100'
              }`}
            >
              {!isOwnMessage && (
                <div className="text-sm font-semibold text-gray-700">{msg.sender.name}</div>
              )}
              {msg.type === 'text' ? (
                <div className="text-base whitespace-pre-wrap">{msg.content}</div>
              ) : (
                <div className="text-base text-blue-600 underline">{msg.fileName}</div>
              )}
              <div className="text-xs text-gray-400 text-right">
                {new Date(msg.time).toLocaleString()} {/* 👈 hiển thị ngày + giờ */}
              </div>
            </div>

            {/* Avatar rỗng cho tin nhắn của mình để căn đều nếu cần */}
            {isOwnMessage && (
              <div className="ml-2 w-8 h-8" />
            )}
          </div>
        );
      })}

      {/* Context menu */}
      {contextMenu.visible && (
        <ul
          ref={contextMenuRef}
          style={{
            position: 'fixed',
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
              style={{ padding: '8px 12px', cursor: 'pointer', userSelect: 'none' }}
              onMouseDown={(e) => e.preventDefault()}
            >
              Chỉnh sửa
            </li>
          )}
          {contextMenu.message?.type !== 'text' && (
            <li
              onClick={handleDownload}
              style={{ padding: '8px 12px', cursor: 'pointer', userSelect: 'none' }}
              onMouseDown={(e) => e.preventDefault()}
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