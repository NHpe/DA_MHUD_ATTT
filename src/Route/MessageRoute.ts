import MessageController from "../Controller/MessageController";
import { Router } from "express";

const MessageRoute = Router();

MessageRoute.post('/add-message', MessageController.addNewMessage);

MessageRoute.post('/remove-massage', MessageController.removeMessage);

MessageRoute.post('get-message-chat', MessageController.getMessageListOfChat);

export default MessageRoute;