import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();


router.post('/register', registerUser);
router.post('/login', loginUser);

// --- Google OAuth Routes ---


router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// This is the callback route that Google redirects to after authentication
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    // On successful authentication, req.user is available.
    // Create a JWT for the user.
    const payload = { 
        id: req.user.id,
        email: req.user.email,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' });

    // Redirect user to the frontend with the token
    // You can also send user data if you want
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  }
);

export default router;