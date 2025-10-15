import express from 'express';
import {
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  getUserSettings,
  updateUserSettings,
  sendConnectionRequest,
  getConnectionRequests,
  acceptConnectionRequest,
  rejectConnectionRequest,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getAllUsers);
router.route('/profile').put(protect, updateUserProfile);
router.route('/profile/:email').get(getUserProfile);
router.route('/settings').get(protect, getUserSettings).put(protect, updateUserSettings);
router.route('/connections/request').post(protect, sendConnectionRequest);
router.route('/connections/requests').get(protect, getConnectionRequests);
router.route('/connections/accept').post(protect, acceptConnectionRequest);
router.route('/connections/reject').post(protect, rejectConnectionRequest);

export default router;