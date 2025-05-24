import { Types, connection, mongo } from "mongoose";
import { GridFSBucket } from "mongodb";
import { Message } from "../Models/MessageModel";

import crypto, { randomBytes, randomFill } from 'node:crypto';
import { time } from "node:console";

class MessageService {
    async addNewMessage(chatId : Types.ObjectId, sender : Types.ObjectId, type : string, content : string, chatKey : Buffer, file) {
        try {
            const iv = crypto.randomFillSync(new Uint8Array(16))
            if (type === 'text') {
                // Thự hiện mã hóa tin nhắn dạng text
                const cipher = crypto.createCipheriv('aes-256-cbc', chatKey, iv);

                let encrypted = cipher.update(content, 'utf-8', 'base64');
                encrypted += cipher.final('base64');

                const newMessage = new Message({
                    chat: chatId,
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
                    chat: chatId,
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

    async getMessageListOfChat(chatId: Types.ObjectId) {
        try {
            const data = await Message.find({chat: chatId});

            if (data) {
                return {
                    status: 'success',
                    message: 'Message list retrieved successfully',
                    data: data
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

    async decryptTextMessage(messageId : Types.ObjectId, chatKey : Buffer) {
        try {
            const message = await Message.findById(messageId);

            const decipher = crypto.createDecipheriv('aes-256-cbc', chatKey, message.iv);
            let decrypted = decipher.update(message.content, 'base64', 'utf-8');
            decrypted += decipher.final('utf-8');

            return {
                status: 'success',
                message: 'Get plain message successfully',
                data: decrypted
            }

        } catch (error) {
            return {
                status: 'error',
                message: error.message
            }
        }
    }

    async decryptedFileMessage(messageId : Types.ObjectId, chatKey: Buffer) {
        try {
            
        } catch (error) {
            return {
                status: 'error',
                message: error.message
            }
        }
    }
}

export default new MessageService();