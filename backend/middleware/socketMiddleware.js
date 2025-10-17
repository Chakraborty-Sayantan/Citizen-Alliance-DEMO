import { io, users } from '../socket/socket.js'; 

export const socketMiddleware = (req, res, next) => {
    req.io = io;
    req.users = users;
    next();
};