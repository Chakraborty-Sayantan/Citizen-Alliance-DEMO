import Post from '../models/Post.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';


// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name title profileImage email')
      .populate('comments.user', 'name title profileImage email')
      .populate('originalPost')
      .populate({
        path: 'originalPost',
        populate: {
          path: 'author',
          select: 'name title profileImage email'
        }
      })
      .sort({ timestamp: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get a single post by ID
// @route   GET /api/posts/:id
// @access  Private
export const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'name title profileImage email')
            .populate('comments.user', 'name title profileImage email')
            .populate('originalPost')
            .populate({
                path: 'originalPost',
                populate: {
                    path: 'author',
                    select: 'name title profileImage email'
                }
            });

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get posts by user
// @route   GET /api/posts/user/:userId
// @access  Public
export const getPostsByUser = async (req, res) => {
    try {
        const posts = await Post.find({ author: req.params.userId })
            .populate('author', 'name title profileImage email')
            .populate('comments.user', 'name title profileImage email')
            .sort({ timestamp: -1 });
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

// @desc    Create a post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const newPost = new Post({
      content: req.body.content,
      attachment: req.body.attachment,
      author: user.id,
    });

    const post = await newPost.save();
    await post.populate('author', 'name title profileImage email');

    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Like or unlike a post
// @route   POST /api/posts/:id/like
// @access  Private
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    const isLiked = post.likes.some((like) => like.equals(req.user.id));

    if (isLiked) {
      post.likes = post.likes.filter((like) => !like.equals(req.user.id));
    } else {
      post.likes.push(req.user.id);

      if (post.author.toString() !== req.user.id) {
        const notification = new Notification({
            user: post.author,
            sender: req.user.id,
            type: 'like',
            post: post._id,
        });
        await notification.save();
        const populatedNotification = await Notification.findById(notification._id).populate('sender', 'name profileImage email').populate('post', '_id');
        
        // Emit to specific user if they are online
        const recipientSocketId = req.users[post.author.toString()];
        if (recipientSocketId) {
            req.io.to(recipientSocketId).emit('new_notification', populatedNotification);
        }
      }
    }

    await post.save();
    await post.populate('author', 'name title profileImage email');
    await post.populate('comments.user', 'name title profileImage email');

    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Comment on a post
// @route   POST /api/posts/:id/comment
// @access  Private
export const commentOnPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    const newComment = {
      text: req.body.text,
      user: req.user.id,
    };

    post.comments.unshift(newComment);

    if (post.author.toString() !== req.user.id) {
        const notification = new Notification({
            user: post.author,
            sender: req.user.id,
            type: 'comment',
            post: post._id,
        });
        await notification.save();
        const populatedNotification = await Notification.findById(notification._id).populate('sender', 'name profileImage email').populate('post', '_id');
        const recipientSocketId = req.users[post.author.toString()];
        if (recipientSocketId) {
            req.io.to(recipientSocketId).emit('new_notification', populatedNotification);
        }
    }

    await post.save();
    await post.populate('author', 'name title profileImage email');
    await post.populate('comments.user', 'name title profileImage email');

    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Like or unlike a comment
// @route   POST /api/posts/:postId/comment/:commentId/like
// @access  Private
export const likeComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).json({ msg: 'Post not found' });

        const comment = post.comments.id(req.params.commentId);
        if (!comment) return res.status(404).json({ msg: 'Comment not found' });

        const isLiked = comment.likes.some((like) => like.equals(req.user.id));

        if (isLiked) {
            comment.likes = comment.likes.filter((like) => !like.equals(req.user.id));
        } else {
            comment.likes.push(req.user.id);
        }

        await post.save();
        await post.populate('author', 'name title profileImage email');
        await post.populate('comments.user', 'name title profileImage email');

        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

// @desc    Reply to a comment
// @route   POST /api/posts/:postId/comment/:commentId/reply
// @access  Private
export const replyToComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).json({ msg: 'Post not found' });

        const comment = post.comments.id(req.params.commentId);
        if (!comment) return res.status(404).json({ msg: 'Comment not found' });

        const newReply = {
            text: req.body.text,
            user: req.user.id,
        };

        comment.replies.push(newReply);
        
        if (comment.user.toString() !== req.user.id) {
            const notification = new Notification({
                user: comment.user,
                sender: req.user.id,
                type: 'reply',
                post: post._id,
            });
            await notification.save();
            const populatedNotification = await Notification.findById(notification._id).populate('sender', 'name profileImage email').populate('post', '_id');
            const recipientSocketId = req.users[comment.user.toString()];
            if (recipientSocketId) {
                req.io.to(recipientSocketId).emit('new_notification', populatedNotification);
            }
        }

        await post.save();
        await post.populate('author', 'name title profileImage email');
        await post.populate('comments.user', 'name title profileImage email');

        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

export const likeReply = async (req, res) => {
  try {
      const post = await Post.findById(req.params.postId);
      if (!post) return res.status(404).json({ msg: 'Post not found' });

      const comment = post.comments.id(req.params.commentId);
      if (!comment) return res.status(404).json({ msg: 'Comment not found' });

      const reply = comment.replies.id(req.params.replyId);
      if (!reply) return res.status(404).json({ msg: 'Reply not found' });

      const isLiked = reply.likes.some((like) => like.equals(req.user.id));

      if (isLiked) {
          reply.likes = reply.likes.filter((like) => !like.equals(req.user.id));
      } else {
          reply.likes.push(req.user.id);
      }

      await post.save();
      await post
          .populate('author', 'name title profileImage email')
          .populate('comments.user', 'name title profileImage email')
          .populate('comments.replies.user', 'name title profileImage email')
          .execPopulate();

      res.json(post);
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
  }
};



// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = async (req, res) => {
  try {
      const post = await Post.findById(req.params.id);
      if (!post) {
          return res.status(404).json({ msg: 'Post not found' });
      }
      if (post.author.toString() !== req.user.id) {
          return res.status(401).json({ msg: 'User not authorized' });
      }
      await post.deleteOne();
      res.json({ msg: 'Post removed' });
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
  }
}

// @desc    Repost a post
// @route   POST /api/posts/:id/repost
// @access  Private
export const repostPost = async (req, res) => {
  try {
      const originalPost = await Post.findById(req.params.id);

      if (!originalPost) {
          return res.status(404).json({ msg: 'Original post not found' });
      }

      const newPost = new Post({
          content: req.body.content,
          author: req.user.id,
          originalPost: originalPost._id,
          isRepost: true,
      });

      const repost = await newPost.save();

      originalPost.reposts.push(repost._id);
      await originalPost.save();

      if (originalPost.author.toString() !== req.user.id) {
          const notification = new Notification({
              user: originalPost.author,
              sender: req.user.id,
              type: 'repost',
              post: originalPost._id,
          });
          await notification.save();
          const populatedNotification = await Notification.findById(notification._id).populate('sender', 'name profileImage email').populate('post', '_id');
          const recipientSocketId = req.users[originalPost.author.toString()];
          if (recipientSocketId) {
              req.io.to(recipientSocketId).emit('new_notification', populatedNotification);
          }
      }
      
      await repost.populate('author', 'name title profileImage email');
      await repost.populate({
          path: 'originalPost',
          populate: {
              path: 'author',
              select: 'name title profileImage email'
          }
      });

      res.json(repost);
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
  }
};