import express from 'express';
import {
  fetchUserProfile,
  updateUserProfile,
  searchUsers,
  sendConnectionRequest,
  acceptConnectionRequest,
  rejectConnectionRequest,
  getNotifications,
  getConnections
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile/:email', protect, fetchUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/search', protect, searchUsers);
router.post('/connect/:userId', protect, sendConnectionRequest);
router.post('/accept/:userId', protect, acceptConnectionRequest);
router.post('/reject/:userId', protect, rejectConnectionRequest);
router.get('/notifications', protect, getNotifications);
router.get('/connections', protect, getConnections);

export default router;