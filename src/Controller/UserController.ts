import UserService from "../Services/UserService"; 

class UserController {
    async registerUser(req, res) {
        try {
            const {account, password} = req.body;
            const result = await UserService.registerUser(account, password);
    
            if (result.status === 'success') {
                res.status(200).json({
                    message: result.message
                });
            } else if (result.status === 'error') {
                res.status(500).json({
                    message: result.message
                });
            } else {
                res.status(400).json({
                    message: result.message,
                });
            }
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }

    async loginUser(req, res) {
        try {
            const {account, password} = req.body;
            const result = await UserService.loginUser(account, password);

            if (result.status === 'success') {
                res.status(200).json({
                    message: result.message
                });
            } else if (result.status === 'error') {
                res.status(500).json({
                    message: result.message
                });
            } else {
                res.status(400).json({
                    message: result.message,
                });
            }
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }

    async getFriendList(req, res) {
        try {
            const {userId} = req.body;
            const result = await UserService.getFriendList(userId);

            if (result.status === 'success') {
                res.status(200).json({
                    message: result.message,
                    data: result.data
                });
            } else if (result.status === 'error') {
                res.status(500).json({
                    message: result.message
                });
            } else {
                res.status(400).json({
                    message: result.message,
                });
            }
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }
}

export default new UserController()