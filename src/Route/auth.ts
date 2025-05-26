import { Router, Request, Response } from 'express';
import User from '../Models/UserModel';

const authRouter = Router();

function authenticateJWT(req: Request, res: Response) {
    if (req.isAuthenticated()) {
        res.json({
            user: {
            _id: req.User._id,
            account: req.User.account,
            name: req.User.name,
            avatar: req.User.avatar,
            friendList: req.User.friendList
            }
        });
    }
    else
            res.status(401).json({ message: 'Unauthorized' });
}

authRouter.get('/', authenticateJWT);

export default authRouter;