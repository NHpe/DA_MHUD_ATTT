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

    async getChatList(req, res) {
        try {
            const {chatList} = req.body;
            const result = await ChatService.getChatList(chatList);

            if (result.status === 'success') {
                return res.status(200).json({chats: result.data});
            } else if (result.status === 'error') {
                return res.status(500).json({message: result.message});
            } else {
                return res.status(400).json({message: result.message});
            }
        } catch (error) {
            return res.status(500).json({message: error.message});
            
        }
    }
}

export default new ChatController();