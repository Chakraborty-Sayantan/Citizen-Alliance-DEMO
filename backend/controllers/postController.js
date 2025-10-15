import Post from '../models/Post.js';
import User from '../models/User.js';

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name title profileImage email')
      .populate('comments.user', 'name title profileImage email')
      .sort({ timestamp: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

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

    // Check if the post has already been liked by this user
    if (post.likes.some((like) => like.equals(req.user.id))) {
      // Unlike the post
      post.likes = post.likes.filter(
        (like) => !like.equals(req.user.id)
      );
    } else {
      // Like the post
      post.likes.push(req.user.id);
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

    await post.save();
    await post.populate('author', 'name title profileImage email');
    await post.populate('comments.user', 'name title profileImage email');


    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};