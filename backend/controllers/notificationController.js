import Notification from '../models/Notification.js';

// @desc    Get notifications for logged in user
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user.id })
            .populate('sender', 'name profileImage')
            .sort({ timestamp: -1 });
        res.json(notifications);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Mark all notifications as read
// @route   POST /api/notifications/read
// @access  Private
export const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany({ user: req.user.id, read: false }, { $set: { read: true } });
        res.status(200).json({ msg: "All notifications marked as read" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}