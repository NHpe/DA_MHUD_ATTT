// models/Message.ts
import { Schema, model, Types, Model } from 'mongoose';

interface IMessage {
    chatId: Types.ObjectId;
    sender: Types.ObjectId;
    type: 'text' | 'file';
    content?: string;
    fileId?: Types.ObjectId;
    fileName? : string;
    mimeType? : string;
    iv: Buffer;
    time: Date;
}

type MessageModel = Model<IMessage>;

const messageSchema = new Schema<IMessage>({
    chatId: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
        type: String,
        enum: ['text', 'file']
    },
    content: { type: String},
    fileId: {type: Schema.Types.ObjectId},
    fileName: { type: String},
    mimeType: { type: String},
    iv: { type: Buffer },
    time: { type: Date, default: Date.now }
});

export const Message = model<IMessage, MessageModel>('Message', messageSchema);