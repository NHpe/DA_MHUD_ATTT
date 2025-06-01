import { Schema, model, Types, Model } from 'mongoose';

export interface IChat {
  name: string;
  chatKey: Buffer;
  participantList: Types.ObjectId[];
}

type ChatModel = Model<IChat>;

const chatSchema = new Schema<IChat>({
    name: String,
    chatKey: { type: Buffer, required: true },
    participantList: [
        { type: Schema.Types.ObjectId, ref: 'User', required: true }
    ]
});

export const Chat = model<IChat, ChatModel>('Chat', chatSchema);