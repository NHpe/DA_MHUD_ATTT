import { Schema, model, Types } from "mongoose";
import User from "./UserModel";


// Create interface
interface IFriend {
    fromUser: Types.ObjectId,
    toUser: Types.ObjectId,

    status: {
        type: string,
        enum: ['pending', 'accepted', 'blocked']
    }
}

// Create Schema
const friendSchema = new Schema<IFriend>({
    fromUser: Types.ObjectId,
    toUser: Types.ObjectId,
    status: {
        type: String,
        enum: ['pending', 'requested', 'accepted'],
        default: 'pending'
    }
});

// Create Model
const Friend = model<IFriend>('Friend', friendSchema);

export default Friend;