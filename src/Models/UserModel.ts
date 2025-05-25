import { Schema, model, Types } from "mongoose";

// Create interface
interface IUser {
    account: string;
    password: string;
    name: string;
    friendList: {
        type: Types.ObjectId,
        ref: 'User'}[];
    avatar?: {
        data: Buffer,
        mimetype: string
    }
};


// Create schema
const userSchema = new Schema<IUser>({
    account: {type: String, required: true},
    password: {type: String, required: true},
    name: {type: String},
    friendList: [{
        type: Types.ObjectId,
        ref: 'User'
    }],
    avatar: {
        data: Buffer,
        mimetype: String
    }
});

// Create model
const User = model<IUser>('User', userSchema);

export default User;