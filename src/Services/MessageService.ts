import { Types, connection, mongo } from "mongoose";
import { GridFSBucket, ObjectId } from "mongodb";
import { Message } from "../Models/MessageModel";

import crypto, { randomBytes, randomFill } from 'node:crypto';
import fs from 'fs';

class MessageService {
    async addNewMessage(chatId : Types.ObjectId, sender : Types.ObjectId, type : string, content : string, chatKey : Buffer, file) {
        try {
            const iv = Buffer.from(crypto.randomFillSync(new Uint8Array(16)));
            if (type === 'text') {
                // Thự hiện mã hóa tin nhắn dạng text
                const cipher = crypto.createCipheriv('aes-256-cbc', chatKey, iv);

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
            }
            else if (file) {
                const cipher = crypto.createCipheriv('aes-256-cbc', chatKey, iv);
                const encryptedBuffer = Buffer.concat([
                    cipher.update(file.buffer),
                    cipher.final()
                ]);

                const bucket = new mongo.GridFSBucket(connection.db, {
                    bucketName: 'files'
                });

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
            }
 
            return {
                status: 'success',
                message: 'Message added successfully'
            }
        } catch (error) {
            return {
                status: 'error',
                message:error.message
            }
        }
    }

    async removeMessage(messageId: Types.ObjectId) {
        try {
            const result = await Message.findByIdAndDelete(messageId, {
                $pull: { _id: messageId}
            });

            await result.save();

            if (result) {
                return {
                    status: 'success',
                    message: 'Message removed successfully'
                }
            }

            return {
                status: 'warning',
                message: 'Failed to remove message or message not found'
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
            const data = await Message.find({chat: chatId});

            let messageList = []

            for (const message of data) {
                if (message.type === 'text') {
                    const iv = message.iv; // Kiểu Buffer
                    const encryptedContent = message.content;

                    try {
                        const decipher = crypto.createDecipheriv('aes-256-cbc', chatKey, iv);
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

            if (messageList.length > 0) {
                return {
                    status: 'success',
                    message: 'Message list retrieved successfully',
                    data: messageList
                }
            }

            return {
                status: 'warning',
                message: 'Chat not found or message list is empty'
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
            const bucket = new mongo.GridFSBucket(connection.db, {
                bucketName: 'files'
            });

            const downloadStream = bucket.openDownloadStream(new Types.ObjectId(fileId));

            const chunks = [];
            downloadStream.on('data', chunk => chunks.push(chunk));

            return new Promise((resolve, reject) => {
                downloadStream.on('end', () => {
                    const encryptedBuffer = Buffer.concat(chunks);
                    
                    // Giải mã
                    const decipher = crypto.createDecipheriv('aes-256-cbc', chatKey, fileIv);
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
}

export default new MessageService();