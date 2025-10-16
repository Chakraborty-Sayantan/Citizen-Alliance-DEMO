import User from '../models/User.js';
import Notification from '../models/Notification.js';

// @desc    Fetch user profile by email
// @route   GET /api/users/profile/:email
// @access  Private
export const fetchUserProfile = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email })
            .select('-password')
            .populate('connections', 'name profileImage title email')
            .populate('connectionRequests', 'name profileImage title email');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error("Error in fetchUserProfile: ", error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.title = req.body.title || user.title;
            user.location = req.body.location || user.location;
            user.about = req.body.about || user.about;
            user.skills = req.body.skills || user.skills;
            user.experience = req.body.experience || user.experience;
            user.education = req.body.education || user.education;
            if (req.body.profileImage) {
                user.profileImage = req.body.profileImage;
            }
            if (req.body.backgroundImage) {
                user.backgroundImage = req.body.backgroundImage;
            }

            const updatedUser = await user.save();
            res.json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error("Error in updateUserProfile: ", error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Search for users by keyword
// @route   GET /api/users/search
// @access  Private
export const searchUsers = async (req, res) => {
    const keyword = req.query.keyword
        ? {
            name: {
                $regex: req.query.keyword,
                $options: 'i',
            },
        }
        : {};
    const users = await User.find({ ...keyword }).find({ _id: { $ne: req.user._id } });
    res.json(users);
};

// @desc    Send a connection request to a user
// @route   POST /api/users/connect/:userId
// @access  Private
export const sendConnectionRequest = async (req, res) => {
    try {
        const toUser = await User.findById(req.params.userId);
        const fromUser = await User.findById(req.user._id);

        if (!toUser) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (toUser.connectionRequests.includes(fromUser._id) || toUser.connections.includes(fromUser._id)) {
            return res.status(400).json({ msg: 'Request already sent or already connected' });
        }

        toUser.connectionRequests.push(fromUser._id);
        await toUser.save();

        const notification = new Notification({
            user: toUser._id,
            sender: fromUser._id,
            type: 'connection_request',
            message: `${fromUser.name} sent you a connection request.`
        });
        await notification.save();

        res.status(200).json({ msg: 'Connection request sent' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Accept a connection request from a user
// @route   POST /api/users/accept/:userId
// @access  Private
export const acceptConnectionRequest = async (req, res) => {
    try {
        const fromUser = await User.findById(req.params.userId);
        const currentUser = await User.findById(req.user._id);

        if (!fromUser) {
            return res.status(404).json({ msg: 'User not found' });
        }

        currentUser.connections.push(fromUser._id);
        fromUser.connections.push(currentUser._id);

        currentUser.connectionRequests = currentUser.connectionRequests.filter(reqId => !reqId.equals(fromUser._id));

        await currentUser.save();
        await fromUser.save();

        const notification = new Notification({
            user: fromUser._id,
            sender: currentUser._id,
            type: 'connection_accepted',
            message: `${currentUser.name} accepted your connection request.`
        });
        await notification.save();

        res.status(200).json({ msg: 'Connection accepted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get all notifications for the logged-in user
// @route   GET /api/users/notifications
// @access  Private
export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user._id })
            .populate('sender', 'name profileImage')
            .sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        console.error("Error in getNotifications: ", error.message);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Get all connections for the logged-in user
// @route   GET /api/users/connections
// @access  Private
export const getConnections = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate({
            path: 'connections',
            select: 'name profileImage email'
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user.connections);
    } catch (error) {
        console.error("Error in getConnections: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};