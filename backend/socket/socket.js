import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        // Ensure your frontend origin is listed here
        origin: ["http://localhost:3000", "http://localhost:8080"],
        methods: ["GET", "POST"],
    },
});

const userSocketMap = {}; // {userId: socketId}

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
    console.log("a user connected", socket.id);

    const userId = socket.handshake.query.userId;
    // Only map users who provide a valid userId
    if (userId && userId !== "undefined") {
        userSocketMap[userId] = socket.id;
    }

    // Send the list of online users to all clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
        // Remove user from the map on disconnect
        if (userId && userId !== "undefined") {
            delete userSocketMap[userId];
        }
        // Update the list of online users for all clients
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

// Export all necessary modules for use in server.js and controllers
export { app, io, server, userSocketMap };