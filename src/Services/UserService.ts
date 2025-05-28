import User from '../Models/UserModel';
import crypto from 'crypto';
import multer from 'multer';
import { Types } from 'mongoose';

class UserService {
    async registerUser(account, password) {
        try {
            // Kiểm tra người dùng có trong csdl hay không 
            const user = await User.findOne({account});
            if (user) {
                return {
                    status: 'warning',
                    message: 'The user account already existed'
                }
            }

            const hash = crypto.createHash('sha256');
            const hashPassword = hash.update(password).digest('base64');

            const newUser = new User({
                account,
                password: hashPassword,
                name: account
            });

            await newUser.save();
            return {
                status: 'success',
                message: 'Register new user succesfully'
            }
        } catch (error) {
            return {
                status: 'error',
                message: error.message
            }
        }
    }

    async loginUser(account, password) {
        try {
            // Đầu tiên là kiểm tra tài khoản có đungs không 
            const user = await User.findOne({account});

            if (!user) {
                return {
                    status: 'warning',
                    message: 'Account or password is not correct'
                }
            }

            // Kiểm tra mật khẩu được nhâp vào 
            const hash = crypto.createHash('sha256');
            const hashPassword = hash.update(password).digest('base64');

            if (hashPassword !== user.password) {
                return {
                    status: 'warning',
                    message: 'Account or password is not correct'
                } 
            }

            return {
                status: 'success',
                message: 'Login successfully',
                data: user._id
            }

        } catch (error) {
            return {
                status: 'error',
                message: error.message
            }
        }
    }

    async getUserByID (userId) {
        try {
            const user = await User.findById(userId);

            return {
                status: 'success',
                message: 'Get user successfully',
                data: user
            }
        } catch (error) {
            return {
                status: 'error',
                message: error.message
            }
        }
    }

    async getUsersData(userList : Types.ObjectId[]) {
        try {
            const users = await User.find({
                _id: { $in: userList }});
            
            const userListData = users.map(user => ({
                _id: user._id,
                account: user.account,
                name: user.name,
                avatar: user.avatar
            }));

            return {
                status: 'success',
                message: 'Get user list successfully',
                data: userListData
            }
        } catch (error) {
            return {
                status: 'error',
                message: error.message
            }
        }
    }

    async searchUser(query) {
        try {
            const regex = new RegExp(query, 'i'); // Tạo biểu thức chính quy không phân biệt chữ hoa chữ thường
            const users = await User.find(
                { name: regex }
            ).select('_id name');

            return {
                status: 'success',
                message: 'Search user successfully',
                data: users
            }
        } catch (error) {
            return {
                status: 'error',
                message: error.message
            }
        }
    }

    async changePassword(userId, oldPassword, newPassword) {
        try {
            const user = await User.findById(userId);

            // Kiểm tra password cũ
            const hashOld = crypto.createHash('sha256');
            const hashOldPassword = hashOld.update(oldPassword).digest('base64');

            if (hashOldPassword == user.password) {
                const hashNew = crypto.createHash('sha256');
                const hashNewPassword = hashNew.update(newPassword).digest('base64');

                // Cập nhật lại 
                user.password = hashNewPassword;
                await user.save();

                return {
                    status: 'success',
                    message: 'Change password successfully'
                }
            }

            return {
                status: 'warning',
                message: 'Password do not correctly'
            }
        } catch (error) {
            return {
                status: 'error',
                message: error.message
            }
        }
    }

    async uploadAvatar(userID : Types.ObjectId, file) {
        try {
            const user = await User.findByIdAndUpdate(userID, {avatar: {
                data: file.Buffer,
                mimetype: file.mimetype
            }});

            await user.save();

            return {
                status: 'success',
                message: 'Upload avatar successfully'
            }
        } catch (error) {
            return {
                status: 'error',
                message: error.message
            }
        }
    }
}

export default new UserService();