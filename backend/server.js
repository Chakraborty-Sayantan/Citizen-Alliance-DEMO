import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';
import userRoutes from './routes/userRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js'; 
import { createServer } from 'http';
import { Server } from 'socket.io';

dotenv.config();

connectDB();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:8080", 
    methods: ["GET", "POST"]
  }
});

let users = {}; 

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Store user's socket id
  socket.on('register', (userId) => {
    users[userId] = socket.id;
    console.log(`User ${userId} registered with socket ${socket.id}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    for (let userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
        break;
      }
    }
  });
});

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Middleware to attach io and users to req
app.use((req, res, next) => {
  req.io = io;
  req.users = users;
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes); 

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));