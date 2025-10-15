import User from '../models/User.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Public
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get user profile by email
// @route   GET /api/users/profile/:email
// @access  Public
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email }).select('-password').populate('connections', 'name email title profileImage');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            user.name = req.body.name || user.name;
            user.title = req.body.title || user.title;
            user.location = req.body.location || user.location;
            user.about = req.body.about || user.about;
            user.skills = req.body.skills || user.skills;
            user.experience = req.body.experience || user.experience;
            user.education = req.body.education || user.education;
            user.profileImage = req.body.profileImage || user.profileImage;
            user.backgroundImage = req.body.backgroundImage || user.backgroundImage;

            const updatedUser = await user.save();
            res.json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get user settings
// @route   GET /api/users/settings
// @access  Private
export const getUserSettings = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            res.json(user.settings);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Update user settings
// @route   PUT /api/users/settings
// @access  Private
export const updateUserSettings = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            user.settings = { ...user.settings, ...req.body };
            await user.save();
            res.json(user.settings);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


// @desc    Send connection request
// @route   POST /api/users/connections/request
// @access  Private
export const sendConnectionRequest = async (req, res) => {
    try {
        const toUser = await User.findById(req.body.toUserId);
        const fromUser = await User.findById(req.user.id);

        if (!toUser) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (toUser.connectionRequests.includes(fromUser._id) || toUser.connections.includes(fromUser._id)) {
            return res.status(400).json({ msg: 'Request already sent or already connected' });
        }

        toUser.connectionRequests.push(fromUser._id);
        await toUser.save();

        res.status(200).json({ msg: 'Connection request sent' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get incoming connection requests
// @route   GET /api/users/connections/requests
// @access  Private
export const getConnectionRequests = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('connectionRequests', 'name email title profileImage');
        res.json(user.connectionRequests);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Accept connection request
// @route   POST /api/users/connections/accept
// @access  Private
export const acceptConnectionRequest = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const fromUser = await User.findById(req.body.fromUserId);

        if (!fromUser) {
            return res.status(404).json({ msg: 'User not found' });
        }

        user.connections.push(fromUser._id);
        fromUser.connections.push(user._id);

        user.connectionRequests = user.connectionRequests.filter(reqId => !reqId.equals(fromUser._id));

        await user.save();
        await fromUser.save();

        res.status(200).json({ msg: 'Connection accepted' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Reject connection request
// @route   POST /api/users/connections/reject
// @access  Private
export const rejectConnectionRequest = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const fromUser = await User.findById(req.body.fromUserId);

        if (!fromUser) {
            return res.status(404).json({ msg: 'User not found' });
        }

        user.connectionRequests = user.connectionRequests.filter(reqId => !reqId.equals(fromUser._id));
        await user.save();

        res.status(200).json({ msg: 'Connection rejected' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};