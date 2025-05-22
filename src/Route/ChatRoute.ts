import ChatController from "../Controller/ChatController";
import { Router } from "express";

const ChatRoute = Router();

ChatRoute.post('/create', ChatController.createChat);

ChatRoute.post('/add-participant', ChatController.addParticipant);

ChatRoute.post('/remove-participant', ChatController.removeParticipant);

export default ChatRoute;