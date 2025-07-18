import UserService from "../Services/UserService"; 
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { use } from "passport";

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
                const token = jwt.sign(
                    { id: result.data },
                    process.env.JWT_SECRET,
                    { expiresIn: '1d' }
                );

                res.cookie('jwt', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production', // đảm bảo chỉ HTTPS mới gửi cookie
                    sameSite: 'strict', // chống CSRF
                    maxAge: 24 * 60 * 60 * 1000,
                });

                res.status(200).json({
                    message: result.message,
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

    async getUsersData(req, res) {
        try {
            const {userList} = req.body;
            const result = await UserService.getUsersData(userList);

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

    async searchUser(req, res) {
        try {
            const {q} = req.query;
            const result = await UserService.searchUser(q);
            if (result.status === 'success') {
                res.status(200).json({
                    message: result.message,
                    results: result.data
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

    async uploadAvatar(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }
            const file = {
                buffer: req.file.buffer,
                originalname: req.file.originalname,
                mimetype: req.file.mimetype
            }

            let {userId} = req.body;
            userId = new Types.ObjectId(userId);

            const result = await UserService.uploadAvatar(userId, file);

            if (result.status === 'success') {
                res.status(200).json({message: result.message});
            } else {
                res.status(500).json({message: result.message});
            }
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }

    async changePassword(req, res) {
        try {
            const {userId, oldPassword, newPassword} = req.body;

            const result = await UserService.changePassword(userId, oldPassword, newPassword);
            if (result.status === 'success') {
                res.status(200).json({message: result.message});
            } else if (result.status === 'error') {
                res.status(500).json({message: result.message});
            } else {
                res.status(400).json({message: result.message});
            }
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }

    async changeUserName(req, res) {
        try {
            const {newName, userId} = req.body;
            const result = await UserService.changeUserName(userId, newName);

            if (result.status === 'success') {
                res.status(200).json({
                    message: result.message,
                });
            } else if (result.status === 'error') {
                res.status(500).json({
                    message: result.message
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