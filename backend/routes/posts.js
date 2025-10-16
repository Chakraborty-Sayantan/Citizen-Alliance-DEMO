import express from 'express';
import {  getPosts,  createPost,  likePost,  commentOnPost,  deletePost,  getPostsByUser,  repostPost,  replyToComment, getPostById, likeComment} from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getPosts).post(protect, createPost);
router.route('/:id').get(protect, getPostById).delete(protect, deletePost);
router.route('/:id/like').post(protect, likePost);
router.route('/:id/comment').post(protect, commentOnPost);
router.route('/user/:userId').get(getPostsByUser);
router.route('/:id/repost').post(protect, repostPost);
router.route('/:postId/comment/:commentId/reply').post(protect, replyToComment);
router.route('/:postId/comment/:commentId/like').post(protect, likeComment);


export default router;