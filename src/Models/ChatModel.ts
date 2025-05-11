import { Schema, model, Types, Model, HydratedDocument } from "mongoose";

// IMessage interface
interface IMessage {
    sender: {
        type: Types.ObjectId,
        ref: 'User'
    },
    type: {
        type: string,
        enum: ['text', 'image', 'video', 'audio', 'file']
    },
    content: string,
    time: Date
}

// IChat interface
interface IChat {
    name: string;
    type: {
        type: string;
        enum: ['group', 'single'];
    };
    chatKey: Types.Buffer;
    participantList: {
        type: Types.ObjectId;
        ref: 'User';
    }[];
    messageList: IMessage[];
}

// Đây là kiểu Hydrated Document chuẩn
type THydratedChatDocument = HydratedDocument<IChat>;

// ChatModelType không cần override thêm unless bạn có custom method
type ChatModelType = Model<IChat>;

// Schema
const chatSchema = new Schema<IChat>({
    type: {
        type: String,
        enum: ['group', 'single']
    },
    name: String,
    chatKey: Types.Buffer,
    participantList: [
        {
            type: Types.ObjectId,
            ref: 'User'
        }
    ],
    messageList: [
        new Schema<IMessage>({
            sender: {
                type: Types.ObjectId,
                ref: 'User'
            },
            type: {
                type: String,
                enum: ['text', 'image', 'video', 'audio', 'file']
            },
            content: String,
            time: { type: Date, default: Date.now }
        })
    ]
});

// Model
export const Chat = model<IChat, ChatModelType>('Chat', chatSchema);