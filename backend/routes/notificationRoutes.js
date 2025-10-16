import express from 'express';
import { getNotifications, markAllAsRead } from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getNotifications);
router.route('/read').post(protect, markAllAsRead);

export default router;