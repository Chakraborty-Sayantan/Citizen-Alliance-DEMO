import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import { getReceiverSocketId } from '../socket/socket.js';
import { v2 as cloudinary } from 'cloudinary';

export const sendMessage = async (req, res) => {
    // FIX: Configure Cloudinary inside the function to ensure env variables are loaded.
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;
        let fileUrl, fileType;

        if (req.file) {
            const file = req.file;

            if (file.mimetype.startsWith('image')) {
                fileType = 'image';
            } else if (file.mimetype.startsWith('video')) {
                fileType = 'video';
            } else {
                fileType = 'document';
            }

            const result = await cloudinary.uploader.upload(file.path, {
                resource_type: "auto",
            });
            fileUrl = result.secure_url;
        }

        if (!message && !fileUrl) {
            return res.status(400).json({ error: "Message content or file is required" });
        }

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message,
            fileUrl,
            fileType,
        });

        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }

        await Promise.all([conversation.save(), newMessage.save()]);

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            req.io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user._id;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChatId] },
        }).populate("messages");

        if (!conversation) return res.status(200).json([]);

        const messages = conversation.messages;

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getConversations = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const conversations = await Conversation.find({ participants: loggedInUserId }).populate({
            path: "participants",
            select: "name title profileImage email"
        });

        conversations.forEach(conversation => {
            conversation.participants = conversation.participants.filter(
                participant => participant._id.toString() !== loggedInUserId.toString()
            );
        });

        res.status(200).json(conversations);

    } catch (error) {
        console.error("Error in getConversations: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}