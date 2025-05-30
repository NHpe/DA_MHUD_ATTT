import { Types } from "mongoose";
import { Chat } from "../Models/ChatModel";
import User from "../Models/UserModel";
import { encrypt } from "../Ultis/cryption";

import crypto from 'node:crypto'

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
                chatKey = Buffer.from(crypto.randomFillSync(new Uint8Array(32))); // AES-256
            }

            const encryptChatKey = encrypt(chatKey);

            const chat = new Chat({
                name,
                type: isSingle ? 'single' : 'group',
                participantList,
                chatKey : encryptChatKey
            });

            await chat.save();

            for (const participant of participantList) {
                await User.updateOne({
                    _id: participant
                }, {
                    $push: {
                        chatList: chat._id
                    }
                });
            }

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

            await User.updateOne({
                _id: participant
            }, {
                $push: {
                    chatList: chatId
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
            const result = await Chat.findByIdAndUpdate(chatId, { $pull: { participantList: participant } });

            await User.updateOne({
                _id: participant,
            }, {
                $pull: {
                    chatList: chatId
                }
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

    async getChatList(chatList : Types.ObjectId[]) {
        try {
            // Tìm chats
            const chats = await Chat.find({ _id: { $in: chatList } });

            return {
                status: 'success',
                message: 'Chat list retrieved successfully',
                data: chats
            }
        } catch (error) {
            return {
                status: 'error',
                message: error.message
            }
        }
    }

    async changeChatName(chatId : Types.ObjectId, newName : string) {
        try {
            const chat = await Chat.findById(chatId);
            if (!chat) throw new Error('Chat not found');

            chat.name = newName;
            await chat.save();

            if (chat) {
                return {
                    status: 'success',
                    message: 'Changed name successfully'
                }
            }
            return {
                status: 'error',
                message: 'Failed to change name'
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