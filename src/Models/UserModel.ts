import { Schema, model, Types } from "mongoose";
import Friend from "./FriendModel";

// Create interface
interface IUser {
    account: string;
    password: string;
    name: string;
    friendList: {
        type: Types.ObjectId,
        ref: 'Friend'}[];
    };


// Create schema
const userSchema = new Schema<IUser>({
    account: {type: String, required: true},
    password: {type: String, required: true},
    name: String,
    friendList: [{
        type: Types.ObjectId,
        ref: 'User'
    }]
});

// Create model
const User = model<IUser>('User', userSchema);

export default User;