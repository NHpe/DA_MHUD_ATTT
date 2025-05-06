import FriendService from "../Services/FriendService";

class FriendController {
    async sendFriendRequest(req, res) {
        try {
            const { fromUser, toUser } = req.body;
            const result = await FriendService.sendFriendRequest(fromUser, toUser);

            if (result.status === 'error') {
                return res.status(500).json({ message: result.message} );
            } else if (result.status === 'warning') {
                return res.status(400).json( {message: result.message} );
            } else {
                return res.status(200).json( {message: result.message});
            }
        } catch (error) {
            return res.status(500).json( {message: error.message });
        }
    }

    async accpetFriendRequest(req, res) {
        try {
            const { fromUser, toUser } = req.body;
            const result = await FriendService.acceptFriendRequest(fromUser, toUser);

            if (result.status === 'error') {
                return res.status(500).json({ message: result.message} );
            } else if (result.status === 'warning') {
                return res.status(400).json( {message: result.message} );
            } else {
                return res.status(200).json( {message: result.message});
            }
        } catch (error) {
            return res.status(500).json( {message: error.message });
        }
    }

    async rejectFriendRequest(req, res) {
        try {
            const { fromUser, toUser } = req.body;
            const result = await FriendService.rejectFriendRequest(fromUser, toUser);

            if (result.status === 'error') {
                return res.status(500).json({ message: result.message} );
            } else if (result.status === 'warning') {
                return res.status(400).json( {message: result.message} );
            } else {
                return res.status(200).json( {message: result.message});
            }
        } catch (error) {
            return res.status(500).json( {message: error.message });
        }
    }

    async unfriend(req, res) {
        try {
            const { fromUser, toUser } = req.body;
            const result = await FriendService.unfriend(fromUser, toUser);

            if (result.status === 'error') {
                return res.status(500).json({ message: result.message} );
            } else if (result.status === 'warning') {
                return res.status(400).json( {message: result.message} );
            } else {
                return res.status(200).json( {message: result.message});
            }
        } catch (error) {
            return res.status(500).json( {message: error.message });
        }
    }
}

export default new FriendController();