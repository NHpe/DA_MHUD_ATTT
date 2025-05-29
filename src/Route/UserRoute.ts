import UserController from "../Controller/UserController";
import { Router } from "express";
import upload from "../Middleware/upload";

const UserRouter = Router();

UserRouter.post('/get-users-data', UserController.getUsersData);

UserRouter.post('/upload-avatar', upload.single('avatar'), UserController.uploadAvatar);

UserRouter.get('/search', UserController.searchUser);

UserRouter.post('/change-user-name', UserController.changeUserName);

export default UserRouter;