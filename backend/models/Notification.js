import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User who receives the notification
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User who triggered the notification
  type: { type: String, enum: ['like', 'comment', 'reply', 'repost', 'connection_request', 'connection_accepted'], required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }, // Related post, if applicable
  read: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;