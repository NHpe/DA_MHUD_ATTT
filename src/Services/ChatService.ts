import { Types } from "mongoose";
import Chat from "../Models/ChatModel";

class ChatService {
    async createChat(isSingle: boolean, name: string, participantList: Types.ObjectId[]) {
        try {
            if (isSingle) {
                name = "";
            }

            const chat = new Chat({
                name,
                type: isSingle ? 'single' : 'group',
                participantList
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
                message: result.errors
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
                message: data.errors
            }
        } catch (error) {
            return {
                status: 'error',
                message: error.message
            }
        }
    }

    async addMessage(chatId: Types.ObjectId, message: Types.ObjectId) {
        try {
            await Chat.updateOne({
                _id: chatId
            }, {
                $push: {
                    messageList: message
                }
            });

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
                message: result.errors
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