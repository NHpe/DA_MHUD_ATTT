import UserController from "../Controller/UserController";
import { Router } from "express";

const UserRouter = Router();

UserRouter.post('/register', UserController.registerUser);

UserRouter.post('/login', UserController.loginUser);

export default UserRouter;