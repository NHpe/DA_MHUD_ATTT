import { Types } from "mongoose";
import { Chat } from "../Models/ChatModel";

import crypto, { randomBytes } from 'node:crypto'

class ChatService {
    async createChat(isSingle: boolean, name: string, participantList: Types.ObjectId[]) {
        try {
            let chatKey;
            // Tạo khóa cho đoạn chat 
            if (isSingle) {
                const sortedUserId = [participantList[0].toString(), participantList[1].toString()].sort().join(':');
                chatKey = crypto.scryptSync(sortedUserId, 'salt', 32); // AES-256
            }
            else {
                chatKey = randomBytes(32); // AES-256
            }

            const chat = new Chat({
                name,
                type: isSingle ? 'single' : 'group',
                participantList,
                chatKey
            });

            await chat.save();

            return {
                status: 'success',
                message: 'Chat created successfully'
            }
        } catch (error) {
            return {
                status: 'error',
                message: error.message
            }
        }
    }

    async addParticipant(chatId: Types.ObjectId, participant: Types.ObjectId) {
        try {
            await Chat.updateOne({
                _id: chatId
            }, {
                $push: {
                    participantList: participant
                }
            });

            return {
                status: 'success',
                message: 'Participant added successfully'
            }

        } catch (error) {
            return {
                status: 'error',
                message: error.message
            }
        }
    }

    async removeParticipant(chatId: Types.ObjectId, participant: Types.ObjectId) {
        try {
            const result = await Chat.findByIdAndDelete(chatId, {
                participantList: { $pull : { _id : participant}}
            });

            if (result) {
                return {
                    status: 'success',
                    message: 'Participant removed successfully'
                }
            }

            return {
                status: 'error',
                message: 'Failed to remove participant or participant not found'
            }
        } catch (error) {
            return {
                status: 'error',
                message: error.message
            }
        }
    }

    async getMessageList(chatId: Types.ObjectId) {
        try {
            const data = await Chat.findById(chatId).populate('messageList').exec();

            if (data) {
                return {
                    status: 'success',
                    message: 'Message list retrieved successfully',
                    data: data.messageList
                }
            }

            return {
                status: 'error',
                message: 'Chat not found or message list is empty'
            }
        } catch (error) {
            return {
                status: 'error',
                message: error.message
            }
        }
    }

    async addMessage(chatId: Types.ObjectId, sender: Types.ObjectId, type: string, content: string) {
        try {
            const chat = await Chat.findById(chatId);

            chat.messageList.push({
                sender: { type: sender, ref: 'User' },
                type: { type, enum: ['text', 'image', 'video', 'audio', 'file'] },
                content,
                time: new Date(Date.now())
            })

            await chat.save()

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

    async removeMessage(chatId: Types.ObjectId, message: Types.ObjectId) {
        try {
            const result = await Chat.findByIdAndDelete(chatId, {
                messageList: {
                    $pull: { _id: message}
                }
            });

            if (result) {
                return {
                    status: 'success',
                    message: 'Message removed successfully'
                }
            }

            return {
                status: 'error',
                message: 'Failed to remove message or message not found'
            }

        } catch (error) {
            return {
                status: 'error',
                message: error.message
            }
        }
    }
}

export default new ChatService();