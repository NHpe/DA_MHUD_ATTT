import MessageService from "../Services/MessageService";

class MessageController {
    async createMessage(req, res) {
        try {
            const {sender, type, content} = req.body;
            const result = await MessageService.createMessage(sender, type, content);

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

    async deleteMessage(req, res) {
        try {
            const {messageId} = req.body;
            const result = await MessageService.deleteMessage(messageId);

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