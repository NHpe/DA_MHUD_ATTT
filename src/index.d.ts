import 'express';
import { Types } from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      User?: {
        _id: Types.ObjectId;
        account: string;
        name: string;
        friendList: {
            type: Types.ObjectId,
            ref: 'User'}[];
        chatList: {
            type: Types.ObjectId,
            ref: 'Chat'}[];
        avatar?: {
            data: Buffer,
            mimetype: string
        }
      };
    }
  }
}