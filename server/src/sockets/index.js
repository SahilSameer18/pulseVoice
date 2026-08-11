import { registerCallHandlers } from './callHandler.js';

export function initializeSockets(io) {
  io.on('connection', (socket) => {
    console.log(`[Socket.IO] New client connected: ${socket.id}`);
    registerCallHandlers(io, socket);
  });
}