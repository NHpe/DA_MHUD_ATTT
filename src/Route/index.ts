import UserRouter from "./UserRoute";
import FriendRouter from "./FriendRoute";

import UserController from "../Controller/UserController";

function route(app) {
    app.post('/register', UserController.registerUser);
    app.post('/login', UserController.loginUser);

    app.use('/user', UserRouter);
    app.use('/friend', FriendRouter);

    app.get('/', (req, res) => {
        res.send('Hello World!');
    });
}

export default route;