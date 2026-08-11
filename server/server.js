import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeSockets } from './src/sockets/index.js';
import { httpErrorHandler } from './src/middlewares/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Express Middleware
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json());

// Health Check REST Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'PulseVoice Server is healthy and running',
    data: {
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    }
  });
});

// Create HTTP Server & Socket.IO Instance
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_URL,
    methods: ['GET', 'POST'],
    credentials: true
  },
  maxHttpBufferSize: 1e7 // 10MB max buffer for voice data
});

// Initialize Socket Event Listeners
initializeSockets(io);

// Express Error Handling Middleware
app.use(httpErrorHandler);

// Start HTTP Server
httpServer.listen(PORT, () => {
  console.log(`[PulseVoice Server] Server running on http://localhost:${PORT}`);
  console.log(`[PulseVoice Server] Socket.IO allowed origin: ${CLIENT_URL}`);
});