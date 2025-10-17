import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';
import userRoutes from './routes/userRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import jobRoutes from './routes/jobRoutes.js';

// Import necessary objects from your socket setup
import { app, server, io, userSocketMap } from './socket/socket.js';

dotenv.config();

// Establish database connection
connectDB();

// Core Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Middleware to attach socket instance and user map to every request
app.use((req, res, next) => {
  req.io = io;
  req.users = userSocketMap; 
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/jobs', jobRoutes);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));