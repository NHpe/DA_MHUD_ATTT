import { Types } from "mongoose";
import Message from "../Models/MessageModel";

class MessageService {
    async createMessage(sender: Types.ObjectId, type: string, content: string) {
        try {
            const newMessage= new Message({
                sender,
                type,
                content
            });

            await newMessage.save();

            return {
                status: 'success',
                message: 'Message created successfully'
            }

        } catch (error) {
            return {
                status: 'error',
                message: error.message
            }
        }
    }

    async deleteMessage(messageId: Types.ObjectId) {
        try {
            const result = await Message.findByIdAndDelete(messageId);

            if (result) {
                return {
                    status: 'success',
                    message: 'Message deleted successfully'
                }
            } 

            return {
                status: 'error',
                message: 'Message not found'
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