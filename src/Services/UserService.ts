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
                password: hashPassword
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
                message: 'Login successfully'
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