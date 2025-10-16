import express from 'express';
import { getMessages, sendMessage, getConversations } from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';
import multer from 'multer';

const router = express.Router();

// Configure multer
const upload = multer({ 
    dest: 'uploads/',
    limits: { fileSize: 30 * 1024 * 1024 } // 30 MB limit
});

router.get("/conversations", protect, getConversations);
router.get("/:id", protect, getMessages);
router.post("/send/:id", protect, upload.single('file'), sendMessage);

export default router;