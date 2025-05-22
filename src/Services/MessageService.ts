import { Types } from "mongoose";
import { Message } from "../Models/MessageModel";

import crypto, { randomBytes, randomFill } from 'node:crypto';

class MessageService {
    async addNewMessage(chatId : Types.ObjectId, sender : Types.ObjectId, type : string, content : string, chatKey : Buffer) {
        try {
            const iv = crypto.randomFillSync(new Uint8Array(16))
            if (type == 'text') {
                // Thự hiện mã hóa tin nhắn dạng text
                const cipher = crypto.createCipheriv('aes-256-cbc', chatKey, iv);

                let encrypted = cipher.update(content, 'utf-8', 'base64');
                encrypted += cipher.final('base64');
                content = encrypted;
            }
            else {

            }

            const newMessage = new Message({
                chat: chatId,
                sender,
                type,
                content,
                iv
            });

            await newMessage.save();

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
}

export default new MessageService();