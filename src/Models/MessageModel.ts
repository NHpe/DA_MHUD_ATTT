import { Schema, model } from "mongoose";

// Create interface
interface IMessage {
    sender: string,
    type: {
        type: string,
        enum: ['text', 'image', 'video', 'audio', 'file']
    }
    content: string,
    time: Date
}

// Create schema
const messageSchema = new Schema<IMessage>({
    sender: {type: String, required: true},
    type: {
        type: String,
        enum: ['text', 'image', 'video', 'audio', 'file'],
        required: true
    },
    content: {type: String, required: true},
    time: {type: Date, default: Date.now}
});

// Create model
const Message = model<IMessage>('Message', messageSchema);

export default Message;