import UserRouter from "./UserRoute";
import FriendRouter from "./FriendRoute";
import ChatRoute from "./ChatRoute";
import MessageRoute from "./MessageRoute";
import authRouter from "./auth";

import UserController from "../Controller/UserController";
import authenticateJWT from "../Middleware/auth";

function route(app) {
    app.post('/register', UserController.registerUser);
    app.post('/login', UserController.loginUser);

    app.use('/user', authenticateJWT, UserRouter);
    app.use('/friend', authenticateJWT, FriendRouter);
    app.use('/chat', authenticateJWT, ChatRoute);
    app.use('/message', authenticateJWT, MessageRoute);
    app.use('/auth', authenticateJWT, authRouter);

    app.get('/', (req, res) => {
        res.send('Hello World!');
    });
}

export default route;