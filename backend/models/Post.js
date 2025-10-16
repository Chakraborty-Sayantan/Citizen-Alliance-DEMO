import mongoose from 'mongoose';

const replySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  replies: [replySchema],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String },
  attachment: {
    type: { type: String, enum: ['image', 'video', 'document'] },
    url: String,
    name: String,
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [commentSchema],
  shares: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  timestamp: { type: Date, default: Date.now },
  isRepost: { type: Boolean, default: false },
  originalPost: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  reposts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
});

// Populate user details in replies as well
const autoPopulateReplies = function(next) {
  this.populate('comments.replies.user', 'name title profileImage email');
  next();
};

postSchema.pre('findOne', autoPopulateReplies);
postSchema.pre('find', autoPopulateReplies);


const Post = mongoose.model('Post', postSchema);

export default Post;