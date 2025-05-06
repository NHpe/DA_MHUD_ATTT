import Friend from "../Models/FriendModel";
import User from "../Models/UserModel";

class FriendService {
    async sendFriendRequest(fromUser, toUser) {
        try {
            // Tạo lời mời kết bạn mới từ người gửi
            const newFriendRequestSender = new Friend({
                fromUser,
                toUser,
                status: 'requested'
            });
            await newFriendRequestSender.save();

            // Tạo lời mời kết bạn mới từ người nhận 
            const newFriendRequestReceiver = new Friend({
                fromUser: toUser,
                toUser: fromUser,
                status: 'pending'
            })
            await newFriendRequestReceiver.save();

            return {
                status: 'success',
                message: 'Send friend request successfully'
            }

        } catch (error) {
            return {
                status: 'error',
                message: error.message
            }
        }
    }

    async acceptFriendRequest(fromUser, toUser) {
        try {
            // Cập nhật trạng thái lời mời kết bạn 
            await Friend.updateOne({
                fromUser,
                toUser,
                status: 'requested'
            }, {
                status: 'accepted'
            });
            
            await Friend.updateOne({
                fromUser: toUser,
                toUser: fromUser,
                status: 'pending'
            }, {
                status: 'accepted'
            });

            // Cập nhật danh sách bạn bè của người dùng 
            await User.updateOne({
                _id: fromUser
                }, {
                $push: {
                    friendList: toUser
                }
            });

            await User.updateOne({
                _id: toUser
                }, {
                    $push: {
                        friendList: fromUser
                    }
                });

            return {
                status: 'success',
                message: 'Accept friend request successfully'
            }
            
        } catch (error) {
            return {
                status: 'error',
                message: error.message
            }
        }
    }

    async rejectFriendRequest(fromUser, toUser) {
        try {
            await Friend.deleteOne({
                fromUser,
                toUser,
                status: 'requested',
            });

            await Friend.deleteOne({
                fromUser: toUser,
                toUser: fromUser,
                statust: 'pending'
            });

            return {
                status: 'success',
                message: 'Reject friend request successfully'
            }
        } catch (error) {
            return {
                status: 'error',
                message: error.message
            }
        }
    }

    async unfriend(fromUser, toUser) {
        try {
            // Xóa kết bạn trong Friend 
            await Friend.deleteOne({
                fromUser,
                toUser,
                status: 'accepted'
            });

            await Friend.deleteOne({
                fromUser: toUser,
                toUser: fromUser,
                status: 'accepted'
            });

            // Xoá trong danh sách bạn bè
            await User.deleteOne({
                _id: fromUser
                }, {
                    $pull: {
                        friendList: toUser
                    }
                });

            await User.deleteOne({
                _id: toUser
                }, {
                    $pull: {
                        friendList: fromUser
                    }
                });

            return {
                status: 'success',
                message: 'Unfriend successfullt'
            }
        } catch (error) {
            return {
                status: 'error',
                message: error.message
            }
        }
    }
}

export default new FriendService();