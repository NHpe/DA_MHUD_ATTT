import FriendController from "../Controller/FriendController";
import { Router } from "express";

const FriendRouter = Router();

FriendRouter.post('/send-request', FriendController.sendFriendRequest);

FriendRouter.post('/accept-request', FriendController.accpetFriendRequest);

FriendRouter.post('/reject-request', FriendController.rejectFriendRequest);

FriendRouter.post('/unfriend', FriendController.unfriend);

FriendRouter.post('/get-friend-request', FriendController.getFriendRequests);

export default FriendRouter;