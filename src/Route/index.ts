import UserRouter from "./UserRoute";
import FriendRouter from "./FriendRoute";
import ChatRoute from "./ChatRoute";
import MessageRoute from "./MessageRoute";

import UserController from "../Controller/UserController";
import authenticateJWT from "../Middleware/auth";

function route(app) {
    app.post('/register', UserController.registerUser);
    app.post('/login', UserController.loginUser);

    app.use('/user', authenticateJWT, UserRouter);
    app.use('/friend', authenticateJWT, FriendRouter);
    app.use('/chat', authenticateJWT, ChatRoute);
    app.use('/message', authenticateJWT, MessageRoute);

    app.get('/auth', authenticateJWT, (req, res) => {
        const user = req.user;
        if (!user) return res.status(401).json({ message: 'Unauthorized' });

        const token = req.cookies.jwt;

        res.json({
            user: {
                _id: user._id,
                account: user.account,
                name: user.name,
                avatar: user.avatar,
                friendList: user.friendList,
                chatList: user.chatList,
            },
            token,
        });
    });

    app.get('/', (req, res) => {
        res.send('Hello World!');
    });
}

export default route;