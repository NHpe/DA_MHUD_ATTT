import ChatController from "../Controller/ChatController";
import { Router } from "express";

const ChatRoute = Router();

ChatRoute.post('/create', ChatController.createChat);

ChatRoute.post('/add-participant', ChatController.addParticipant);

ChatRoute.post('/remove-participant', ChatController.removeParticipant);

ChatRoute.post('/get-chat-list', ChatController.getChatList);

ChatRoute.post('/change-chat-name', ChatController.changeChatName);

ChatRoute.post('/get-chat-infor', ChatController.getChatInfor);

export default ChatRoute;