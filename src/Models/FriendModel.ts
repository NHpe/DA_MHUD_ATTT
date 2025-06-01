import { Schema, model, Types } from "mongoose";

// Create interface
interface IFriend {
    fromUser: Schema.Types.ObjectId,
    toUser: Schema.Types.ObjectId,

    status: {
        type: string,
        enum: ['pending', 'accepted', 'requested'],
    }
}

// Create Schema
const friendSchema = new Schema<IFriend>({
    fromUser: {type : Types.ObjectId, ref: 'User'},
    toUser: {type: Types.ObjectId, ref: 'User'},
    status: {
        type: String,
        enum: ['pending', 'requested', 'accepted'],
        default: 'pending'
    }
});

// Create Model
const Friend = model<IFriend>('Friend', friendSchema);

export default Friend;