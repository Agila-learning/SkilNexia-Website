require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // In production, replace with your frontend URL
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

// Simplified CORS for development
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:5175', 
    'http://localhost:3000', 
    'http://127.0.0.1:5173', 
    'http://127.0.0.1:5175', 
    'https://fic-career-portal.forgeindiaconnect.com',
    'https://skil-nexia-website.vercel.app',
    'https://skil-nexia-website.vercel.app/'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: false, // Allow images/resources to be loaded from other origins
}));

// Rate limiting - Temporarily disabled to debug crash
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
// });
// app.use('/api/', limiter);

// Data sanitization against NoSQL query injection - Disabled due to Express 5 compatibility
// app.use(mongoSanitize());

// Prevent HTTP Parameter Pollution - Disabled due to Express 5 compatibility issues
// app.use(hpp());

// Middleware
app.use(express.json());

// Database Connection
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/skilnexia')
  .then(() => console.log('MongoDB Connected successfully!'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/leads', require('./routes/leadRoutes'));
app.use('/api/courses/:courseId/batches', require('./routes/batchRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/enrollments', require('./routes/enrollmentRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/partners', require('./routes/partnerRoutes'));
app.use('/api/assignments', require('./routes/assignmentRoutes'));
app.use('/api/certificates', require('./routes/certificateRoutes'));
app.use('/api/chats', require('./routes/chatRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Socket.io Logic
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_chat', (chatId) => {
    socket.join(chatId);
    console.log(`User joined chat: ${chatId}`);
  });

  socket.on('send_message', async (data) => {
    const { chatId, senderId, content, messageType = 'text', fileUrl } = data;

    // Save message to database
    try {
      const Message = require('./models/Message');
      const Chat = require('./models/Chat');

      const newMessage = await Message.create({
        chatId,
        sender: senderId,
        content: content || 'Attachment',
        messageType,
        fileUrl
      });

      // Populate sender info before emitting
      await newMessage.populate('sender', 'name role profileImage');

      await Chat.findByIdAndUpdate(chatId, {
        latestMessage: newMessage._id
      });

      // Broadcast to specific chat room
      io.to(chatId).emit('receive_message', newMessage);
    } catch (err) {
      console.error('Socket error:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Basic Route
app.get('/', (req, res) => {
  res.send('Skilnexia API with Real-time Chat is running...');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('ERROR STACK:', err.stack);
  res.status(500).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

// Start Server
server.listen(PORT, () => {
  console.log(`Server (with Socket.io) is running on port ${PORT}`);
});
