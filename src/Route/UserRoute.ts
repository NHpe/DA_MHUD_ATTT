import UserController from "../Controller/UserController";
import { Router } from "express";
import upload from "../Middleware/upload";

const UserRouter = Router();

UserRouter.post('/get-friend-data', UserController.getFriendData);

UserRouter.post('/upload-avatar', upload.single('avatar'), UserController.uploadAvatar);

UserRouter.get('/search', UserController.searchUser);

export default UserRouter;