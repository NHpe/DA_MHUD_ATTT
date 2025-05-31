import { Types, connection, mongo } from "mongoose";
import { Message } from "../Models/MessageModel";
import { decrypt } from "../Ultis/cryption";
import { getGridFsBucketFile } from "../Ultis/gridfs";

import crypto from 'node:crypto';

class MessageService {
    async addNewMessage(chatId : Types.ObjectId, sender : Types.ObjectId, type : string, content : string, chatKey : Buffer, file) {
        try {
            let message;

            const decryptChatKey = decrypt(chatKey);

            const iv = Buffer.from(crypto.randomFillSync(new Uint8Array(16)));
            if (type === 'text') {
                // Thự hiện mã hóa tin nhắn dạng text
                const cipher = crypto.createCipheriv('aes-256-cbc', decryptChatKey, iv);

                let encrypted = cipher.update(content, 'utf-8', 'base64');
                encrypted += cipher.final('base64');

                const newMessage = new Message({
                    chatId,
                    sender,
                    type,
                    content: encrypted,
                    iv,
                    time: new Date()
                });

                await newMessage.save();
                message = await newMessage.populate('sender', 'name');
            }
            else if (file) {
                const cipher = crypto.createCipheriv('aes-256-cbc', decryptChatKey, iv);
                const encryptedBuffer = Buffer.concat([
                    cipher.update(file.buffer),
                    cipher.final()
                ]);

                const bucket = getGridFsBucketFile();

                const uploadStream = bucket.openUploadStream(file.originalname, {
                    contentType: file.mimetype,
                    metadata: {
                        originalname: file.originalname
                    }
                });

                uploadStream.end(encryptedBuffer);

                const fileId = await new Promise((resolve, reject) => {
                    uploadStream.on('finish', () => resolve(uploadStream.id));
                    uploadStream.on('error', reject);
                });

                const newMessage = new Message({
                    chatId,
                    sender,
                    fileId,
                    fileName: file.originalname,
                    mimeType: file.mimetype,
                    iv,
                    time: new Date()
                });

                await newMessage.save();
                message = await newMessage.populate('sender', 'name');
            }

            return {
                status: 'success',
                message: 'Message added successfully',
                data: message
            }
        } catch (error) {
            return {
                status: 'error',
                message:error.message
            }
        }
    }

    async removeMessage(messageId: Types.ObjectId, type: string) {
        try {
            if (type === 'text') {
                const result = await Message.findByIdAndDelete(messageId, {
                    $pull: { _id: messageId}
                });
            } else {
                const fileDoc = await Message.findById(messageId);

                const bucket = getGridFsBucketFile();
                if (fileDoc && fileDoc.fileId) {
                    await bucket.delete(fileDoc.fileId);
                }

                await Message.findByIdAndDelete(messageId, {
                    $pull: { _id: messageId}
                });
            }

            return {
                status: 'success',
                message: 'Message removed successfully'
            }
        } catch (error) {
            return {
                status: 'error',
                message: error.message
            }
        }
    }

    async getMessageListOfChat(chatId: Types.ObjectId, chatKey : Buffer) {
        try {
            const data = await Message.find({chatId}).populate('sender', 'name avatar');

            let messageList = []

            const decryptChatKey = decrypt(chatKey);

            for (const message of data) {
                if (message.type === 'text') {
                    const iv = message.iv; // Kiểu Buffer
                    const encryptedContent = message.content;

                    try {
                        const decipher = crypto.createDecipheriv('aes-256-cbc', decryptChatKey, iv);
                        let decrypted = decipher.update(encryptedContent, 'base64', 'utf-8');
                        decrypted += decipher.final('utf-8');

                        messageList.push({
                            ...message.toObject(),
                            content: decrypted
                        });
                    } catch (err) {
                        messageList.push({
                            ...message.toObject(),
                            content: '[Failed to decrypt]'
                        });
                    }
                } else {
                    // Nếu là file, có thể bạn muốn giữ nguyên content là buffer hoặc base64
                    messageList.push({
                        ...message.toObject(),
                        content: '[Encrypted file or unsupported type]'
                    });
                }
            }

            return {
                status: 'success',
                message: 'Message list retrieved successfully',
                data: messageList
            }
        } catch (error) {
            return {
                status: 'error',
                message: error.message
            }
        }
    }

    async decryptedFileMessage(fileId : Types.ObjectId, chatKey: Buffer, fileIv : Buffer) {
        try {
            const decryptChatKey = decrypt(chatKey);

            const bucket = getGridFsBucketFile();

            const downloadStream = bucket.openDownloadStream(new Types.ObjectId(fileId));

            const chunks = [];
            downloadStream.on('data', chunk => chunks.push(chunk));

            return new Promise((resolve, reject) => {
                downloadStream.on('end', () => {
                    const encryptedBuffer = Buffer.concat(chunks);
                    
                    // Giải mã
                    const decipher = crypto.createDecipheriv('aes-256-cbc', decryptChatKey, fileIv);
                    const decryptedBuffer = Buffer.concat([
                        decipher.update(encryptedBuffer),
                        decipher.final()
                    ]);

                    resolve(decryptedBuffer); // Trả về hoặc gửi buffer này xuống client
                });

                downloadStream.on('error', reject);
            });
        } catch (error) {
            return {
                status: 'error',
                message: error.message
            }
        }
    }

    async editMessage(messageId: Types.ObjectId, newContent: string, chatKey: Buffer) {
        try {
            const decryptChatKey = decrypt(chatKey);
            const message = await Message.findById(messageId);

            const cipher = crypto.createCipheriv('aes-256-cbc', decryptChatKey, message.iv);
            let encrypted = cipher.update(newContent, 'utf-8', 'base64');
            encrypted += cipher.final('base64');

            message.content = encrypted;
            await message.save();

            return {
                status: 'success',
                message: 'Edit message successfully',
                data: message
            }
        } catch (error) {
            return {
                status: 'error',
                message: error.message
            }
        }
    }
}

export default new MessageService();