import express from 'express';
import { checkAuth, login, logout, signup, updateProfile } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// Check if user is authenticated with protectRoute middleware before updating profile 
router.put("/update-profile", protectRoute, updateProfile);

// Check if user is authenticated
router.get("/check-auth", protectRoute, checkAuth);

export default router;