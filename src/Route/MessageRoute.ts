import MessageController from "../Controller/MessageController";
import { Router } from "express";
import upload from "../Middleware/upload";

const MessageRoute = Router();

MessageRoute.post('/add-message', upload.single('file'), MessageController.addNewMessage);

MessageRoute.post('/remove-message', MessageController.removeMessage);

MessageRoute.post('/get-message-chat', MessageController.getMessageListOfChat);

MessageRoute.post('/download-file', MessageController.decryptFileAndDownload);

MessageRoute.post('/edit-message', MessageController.editMessage);

export default MessageRoute;