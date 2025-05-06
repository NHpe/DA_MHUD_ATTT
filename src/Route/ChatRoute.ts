import ChatController from "../Controller/ChatController";
import { Router } from "express";

const ChatRoute = Router();

ChatRoute.post('/create', ChatController.createChat);

ChatRoute.post('/add-participant', ChatController.addParticipant);

ChatRoute.post('/remove-participant', ChatController.removeParticipant);

ChatRoute.post('/get-message-list', ChatController.getMessageList);

ChatRoute.post('/add-message', ChatController.addMessage);

ChatRoute.post('/remove-message', ChatController.removeMessage);

export default ChatRoute;