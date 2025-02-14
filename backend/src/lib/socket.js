import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173'],
  }
})

// to store online users
const userSocketMap = {}; // { userId: socketId }

// get the socketId of the receiver user
export function getReceiverSocketId(receiverUserId) {
  return userSocketMap[receiverUserId];
}

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  // get userId from query
  const { userId } = socket.handshake.query;

  // store the userId and socketId in the map
  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  // io.emit will send the event to all connected clients. 
  //emit the onlineUsers event with the list of online users
  io.emit('getOnlineUsers', Object.keys(userSocketMap));

  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id);

    // remove the userId and socketId from the map when a user disconnects
    delete userSocketMap[userId];
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
  });
})

export { app, io, server };
