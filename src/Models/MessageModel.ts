// models/Message.ts
import { Schema, model, Types, Model } from 'mongoose';

interface IMessage {
    chat: Types.ObjectId;
    sender: Types.ObjectId;
    type: 'text' | 'image' | 'video' | 'audio' | 'file';
    content?: string;
    fileId?: Types.ObjectId;
    filename? : string;
    mimeType? : string;
    iv?: Buffer;
    time: Date;
}

type MessageModel = Model<IMessage>;

const messageSchema = new Schema<IMessage>({
    chat: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
        type: String,
        enum: ['text', 'image', 'video', 'audio', 'file']
    },
    content: { type: String},
    fileId: {type: Schema.Types.ObjectId},
    filename: { type: String},
    mimeType: { type: String},
    iv: { type: Buffer },
    time: { type: Date, default: Date.now }
});

export const Message = model<IMessage, MessageModel>('Message', messageSchema);