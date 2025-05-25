import { Types } from "mongoose";
import { Chat } from "../Models/ChatModel";

import crypto, { randomBytes, randomFill } from 'node:crypto'
import multer from "multer";

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
            const result = await Chat.findByIdAndUpdate(chatId, { $pull: { participantList: participant } });

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
}

export default new ChatService();