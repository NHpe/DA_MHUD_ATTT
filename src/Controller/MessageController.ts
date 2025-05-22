import MessageService from "../Services/MessageService";
import multer from "multer";

class MessageController {
    async addNewMessage(req, res) {
        try {
            const {chatId, sender, type, content, chatKey} = req.body;

            let file = null;
            if (req.file) {
                file = {
                    buffer: req.file.buffer,
                    originalname: req.file.originalname,
                    mimetype: req.file.mimetype
                }
            }

            const result = await MessageService.addNewMessage(chatId, sender, type, content, chatKey, file);

            if (result.status === 'success') {
                return res.status(200).json({message: result.message});
            }
            else {
                return res.status(500).json({message: result.message});
            }
        } catch (error) {
            return res.status(500).json({message: error.message});
        }
    }

    async removeMessage(req, res) {
        try {
            const {messageId} = req.body
            const result = await MessageService.removeMessage(messageId);

            if (result.status === 'success') {
                return res.status(200).json({message: result.message});
            }
            else {
                return res.status(500).json({message: result.message});
            }
        } catch (error) {
            return res.status(500).json({message: error.message});
        }
    }

    async getMessageListOfChat(req, res) {
        try {
            const {chatId} = req.body;
            const result = await MessageService.getMessageListOfChat(chatId);

            if (result.status === 'success') {
                return res.status(200).json({message: result.message});
            }
            else {
                return res.status(500).json({message: result.message});
            }
        } catch (error) {
            return res.status(500).json({message: error.message});
        }
    }
}

export default new MessageController();