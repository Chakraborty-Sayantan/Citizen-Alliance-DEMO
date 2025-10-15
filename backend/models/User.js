import mongoose from 'mongoose';


const experienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: mongoose.Schema.Types.Mixed, required: true }, // Can be Date or String "Present"
  description: String,
});


const educationSchema = new mongoose.Schema({
  school: { type: String, required: true },
  degree: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: mongoose.Schema.Types.Mixed, required: true }, // Can be Date or String "Present"
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  title: String,
  location: String,
  about: String,
  skills: [String],
  experience: [experienceSchema],
  education: [educationSchema],
  profileImage: String,
  backgroundImage: String,
  connections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  connectionRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  profileViews: { type: Number, default: 0 },
  settings: {
    emailNotifications: { type: Boolean, default: true },
    profileVisibility: { type: Boolean, default: true },
    messageNotifications: { type: Boolean, default: true },
    activityStatus: { type: Boolean, default: true },
    allowSearchEngines: { type: Boolean, default: true },
    connectionRequests: { type: Boolean, default: true },
    jobAlerts: { type: Boolean, default: true },
  }
});

const User = mongoose.model('User', userSchema);

export default User;