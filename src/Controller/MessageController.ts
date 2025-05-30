import MessageService from "../Services/MessageService";
import { Types } from "mongoose";

class MessageController {
    async addNewMessage(req, res) {
        try {
            let {chatId, sender, type, content, chatKey} = req.body;
            chatId = new Types.ObjectId(chatId);
            sender = new Types.ObjectId(sender);

            const chatKeyBuffer = Buffer.from(chatKey, 'base64');

            let file = null;
            if (req.file) {
                file = {
                    buffer: req.file.buffer,
                    originalname: req.file.originalname,
                    mimetype: req.file.mimetype
                }
            }

            const result = await MessageService.addNewMessage(chatId, sender, type, content, chatKeyBuffer, file);

            if (result.status === 'success') {
                return res.status(200).json({message: result.message, data: result.data});
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
            const {chatId, chatKey} = req.body;

            const chatKeyBuffer = Buffer.from(chatKey, 'base64');

            const result = await MessageService.getMessageListOfChat(chatId, chatKeyBuffer);

            if (result.status === 'success') {
                return res.status(200).json({
                    message: result.message,
                    data: result.data
                });
            }
            else {
                return res.status(500).json({message: result.message});
            }
        } catch (error) {
            return res.status(500).json({message: error.message});
        }
    }

    async decryptFileAndDownload(req, res) {
        try {
            const {fileId, fileName, mimeType, chatKey, iv} = req.body;

            const chatKeyBuffer = Buffer.from(chatKey, 'base64');
            const ivBuffer = Buffer.from(iv, 'base64');

            const result = await MessageService.decryptedFileMessage(fileId, chatKeyBuffer, ivBuffer);

            if (result) {
                res.setHeader('Content-Type', mimeType);
                res.setHeader(
                    'Content-Disposition',
                    `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`
                );
                res.send(result);
            }
        } catch (error) {
            return res.status(500).json({message: error.message});
        }
    }

    async editMessage(req, res) {
        try {
            const {messageId, newContent, chatKey} = req.body;

            const chatKeyBuffer = Buffer.from(chatKey, 'base64');
            const result = await MessageService.editMessage(messageId, newContent, chatKeyBuffer);
            
            if (result.status === 'success') {
                return res.status(200).json({
                    message: result.message,
                    data: result.data
                });
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