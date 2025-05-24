import User from '../Models/UserModel';
import crypto from 'crypto';

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

    async getFriendList(userId) {
        try {
            const user = await User.findById(userId);

            const friendList = user.friendList.map(async friend => {
                const friend_1 = await User.findById(friend);
                return {
                    name: friend_1.name,
                };
            });

            return {
                status: 'success',
                message: 'Get friend list successfully',
                data: friendList
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
}

export default new UserService();