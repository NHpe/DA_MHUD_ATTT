import UserService from "../Services/UserService"; 

class UserController {
    async registerUser(req, res) {
        const {account, password} = req.body;
        const result = await UserService.registerUser(account, password);

        if (result.status === 'success') {
            res.status(200).json({
                status: result.status,
                message: result.message
            });
        } else if (result.status === 'error') {
            res.status(500).json({
                status: result.status,
                message: result.message
            });
        } else {
            res.status(400).json({
                status: result.status,
                message: result.message,
            });
        }
    }

    async loginUser(req, res) {
        const {account, password} = req.body;
        const result = await UserService.loginUser(account, password);

        if (result.status === 'success') {
            res.status(200).json({
                status: result.status,
                message: result.message
            });
        } else if (result.status === 'error') {
            res.status(500).json({
                status: result.status,
                message: result.message
            });
        } else {
            res.status(400).json({
                status: result.status,
                message: result.message,
            });
        }
    }
}

export default new UserController()