import MessageController from "../Controller/MessageController";
import { Router } from "express";

const MessageRoute = Router();

MessageRoute.post('/create', MessageController.createMessage);

MessageRoute.delete('/delete', MessageController.deleteMessage);

export default MessageRoute;