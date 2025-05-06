import { Schema, model, Types } from "mongoose";
import Message from "./MessageModel";

// Create interface
interface IChat {
    name: string,
    type: {
        type: string,
        enum: ['group', 'single']
    }

    participantList: [Types.ObjectId],

    messageList: [{
        type: Types.ObjectId,
        ref: 'Message'
    }]
}

// Create Schema
const chatSchema = new Schema<IChat>({
    type: {
        type: String,
        enum: ['group', 'single']
    },
    name: String,
    participantList: [Types.ObjectId],
    messageList: [{
        type: Types.ObjectId,
        ref: 'Message'
    }]
});

// Create Model
const Chat = model<IChat>('Chat', chatSchema);

export default Chat;