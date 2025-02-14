import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { connectDB } from './lib/db.js';
import { app, server } from './lib/socket.js';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';

dotenv.config() // Load environment variables

const PORT = process.env.PORT

app.use(express.json()); // Body parser
app.use(cookieParser()); // Cookie parser middleware to parse cookies
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true // to allow cookies from the frontend to pass through the
}));

app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)

server.listen(PORT, () => {
  console.log('Server is running on http://localhost:' + PORT);
  connectDB();
});