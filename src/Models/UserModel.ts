import { Schema, model } from "mongoose";

// Create interface
interface IUser {
    account: string;
    password: string;
    name: string;
}

// Create schema
const userSchema = new Schema<IUser>({
    account: {type: String, required: true},
    password: {type: String, required: true},
    name: String
});

// Create model
const User = model<IUser>('User', userSchema);

export default User