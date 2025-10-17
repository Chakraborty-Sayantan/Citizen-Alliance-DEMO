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
    try {
        const keyword = req.query.keyword
            ? {
                name: {
                    $regex: req.query.keyword,
                    $options: 'i',
                },
            }
            : {};

        const currentUser = await User.findById(req.user._id).select('connections connectionRequests');

        // Find users to whom the current user has sent a connection request
        const usersWithOutgoingRequest = await User.find({ connectionRequests: req.user._id }).select('_id');
        const outgoingRequestUserIds = usersWithOutgoingRequest.map(u => u._id);

        const usersToExclude = [
            req.user._id, // Exclude the current user
            ...currentUser.connections, // Exclude existing connections
            ...currentUser.connectionRequests, // Exclude users who sent a request to the current user
            ...outgoingRequestUserIds, // Exclude users to whom the current user has sent a request
        ];

        const users = await User.find({ ...keyword, _id: { $nin: usersToExclude } }).select('-password');
        res.json(users);
    } catch (error) {
        console.error("Error in searchUsers: ", error.message);
        res.status(500).json({ message: 'Server error' });
    }
};


// @desc    Send a connection request to a user
// @route   POST /api/users/connect/:userId
// @access  Private
export const sendConnectionRequest = async (req, res) => {
    try {
        const toUser = await User.findById(req.params.userId);
        const fromUser = await User.findById(req.user._id);

        if (!toUser) {
            return res.status(404).json({ msg: 'Recipient not found' });
        }

        if (!fromUser) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Check if already connected or request already sent
        if (toUser.connectionRequests.includes(fromUser._id)) {
            return res.status(400).json({ msg: 'Connection request already sent' });
        }

        if (toUser.connections.includes(fromUser._id)) {
            return res.status(400).json({ msg: 'Already connected' });
        }

        // Add connection request
        toUser.connectionRequests.push(fromUser._id);
        await toUser.save();

        // Create notification
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
        const fromUserId = req.params.userId;
        const currentUserId = req.user.id || req.user._id;

        const fromUser = await User.findById(fromUserId);
        const currentUser = await User.findById(currentUserId);

        if (!fromUser) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (!currentUser) {
            return res.status(404).json({ msg: 'Current user not found' });
        }

        // Check if the connection request exists
        if (!currentUser.connectionRequests.some(reqId => reqId.toString() === fromUserId)) {
            return res.status(400).json({ msg: 'No connection request from this user' });
        }

        // Add to connections for both users
        currentUser.connections.push(fromUser._id);
        fromUser.connections.push(currentUser._id);

        // Remove from connection requests
        currentUser.connectionRequests = currentUser.connectionRequests.filter(
            reqId => reqId.toString() !== fromUserId
        );

        await currentUser.save();
        await fromUser.save();

        // Create notification for the user who sent the request
        const notification = new Notification({
            user: fromUser._id,
            sender: currentUser._id,
            type: 'connection_accepted',
            message: `${currentUser.name} accepted your connection request.`
        });
        await notification.save();

        res.status(200).json({ msg: 'Connection accepted' });
    } catch (err) {
        console.error('Error in acceptConnectionRequest:', err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Reject a connection request from a user
// @route   POST /api/users/reject/:userId
// @access  Private
export const rejectConnectionRequest = async (req, res) => {
    try {
        const fromUser = await User.findById(req.params.userId);
        const currentUser = await User.findById(req.user._id);

        if (!fromUser) {
            return res.status(404).json({ msg: 'User not found' });
        }

        currentUser.connectionRequests = currentUser.connectionRequests.filter(
            reqId => !reqId.equals(fromUser._id)
        );

        await currentUser.save();

        res.status(200).json({ msg: 'Connection request rejected' });
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

// @desc    Get all connection requests for the logged-in user
// @route   GET /api/users/connection-requests
// @access  Private
export const getConnectionRequests = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate(
            'connectionRequests',
            'name profileImage title email _id'
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user.connectionRequests);
    } catch (error) {
        console.error('Error in getConnectionRequests: ', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get connection suggestions
// @route   GET /api/users/suggestions
// @access  Private
export const getConnectionSuggestions = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id).populate('connections');
        const friendsOfFriends = new Set();

        if (currentUser.connections.length > 0) {
            for (const connection of currentUser.connections) {
                const friend = await User.findById(connection._id).populate('connections');
                for (const friendOfFriend of friend.connections) {
                    if (
                        !currentUser.connections.some(c => c._id.equals(friendOfFriend._id)) &&
                        !friendOfFriend._id.equals(currentUser._id)
                    ) {
                        friendsOfFriends.add(friendOfFriend._id.toString());
                    }
                }
            }
        }

        let suggestions = await User.find({
            _id: { $in: Array.from(friendsOfFriends) }
        }).select('-password');

        // If no friends of friends, suggest other users
        if (suggestions.length === 0) {
            const allUsers = await User.find().select('-password');
            const connectedUserIds = currentUser.connections.map(c => c._id.toString());
            suggestions = allUsers.filter(user => 
                user._id.toString() !== currentUser._id.toString() && 
                !connectedUserIds.includes(user._id.toString())
            );
        }


        res.json(suggestions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};