import express from 'express';
import { getMessages, getUsers, sendMessage } from '../controllers/message.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get users for sidebar
router.get("/users", protectRoute, getUsers)

// Get messages by receiver id
router.get("/:id", protectRoute, getMessages)

// Send message to receiver by id
router.post("/send/:id", protectRoute, sendMessage)

export default router