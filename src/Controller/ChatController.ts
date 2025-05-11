import ChatService from "../Services/ChatService";

class ChatController {
    async createChat(req, res) {
        try {
            const {isSingle, name, participantList} = req.body;
            const result = await ChatService.createChat(isSingle, name, participantList);

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

    async addParticipant(req, res) {
        try {
            const {chatId, participant} = req.body;
            const result = await ChatService.addParticipant(chatId, participant);

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

    async removeParticipant(req, res) {
        try {
            const {chatId, participant} = req.body;
            const result = await ChatService.removeParticipant(chatId, participant);

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

    async getMessageList(req, res) {
        try {
            const {chatId} = req.body;
            const result = await ChatService.getMessageList(chatId);

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

    async addMessage(req, res) {
        try {
            const {chatId, sender, type, content} = req.body;
            const result = await ChatService.addMessage(chatId, sender, type, content);

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
            const {chatId, message} = req.body;
            const result = await ChatService.removeMessage(chatId, message);

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

export default new ChatController();