import { Schema, model, Types, Model } from 'mongoose';

export interface IChat {
  name?: string;
  type: 'group' | 'single';
  chatKey: Buffer;
  iv: Buffer;
  participantList: Types.ObjectId[];
}

type ChatModel = Model<IChat>;

const chatSchema = new Schema<IChat>({
    name: String,
    type: {
        type: String,
        enum: ['group', 'single'],
        required: true
    },
    chatKey: { type: Buffer, required: true },
    iv: { type: Buffer, required: true },
    participantList: [
        { type: Schema.Types.ObjectId, ref: 'User', required: true }
    ]
});

export const Chat = model<IChat, ChatModel>('Chat', chatSchema);