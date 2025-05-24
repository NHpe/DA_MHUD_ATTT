import UserController from "../Controller/UserController";
import { Router } from "express";
import upload from "../Middleware/upload";

const UserRouter = Router();

UserRouter.post('/get-friend-list', UserController.getFriendList);

UserRouter.post('/upload-avatar', upload.single('avatar'), UserController.uploadAvatar);

export default UserRouter;