// Environment & Dependencies

const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();
const app = require('./app');

// Global Error Handling

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  server.close(() => {
    process.exit(1);
  });
});


// HTTP & Socket.IO Setup
const http = require('http');
const { Server } = require("socket.io");
const server = http.createServer(app);
const socketAuth = require('./middleware/socketAuth');
const { setSocketIo, setActiveUsers, getSocketIo } = require('./utils/socketState');

// Configure Socket.IO with CORS
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: [ "http://localhost:3000",
      "https://kh-media-app.pages.dev" ],
    credentials: true,
  },
});
io.use(socketAuth);

// Active Users Management
const activeUsers = new Map();
setSocketIo(io);
setActiveUsers(activeUsers);


// Socket.IO Events
io.on("connection", (socket) => {
  // Join user to their own room and update active users
  socket.join(socket.user.id);
  activeUsers.set(socket.user.id.toString(), socket.id);
  const usersList = Array.from(activeUsers.keys());
  console.log('Broadcasting activeUsers:', usersList);
  io.emit('activeUsers', usersList);

  // Join user to a chat room
  socket.on('join_chat', (newChatId) => {
    // الخروج من الغرفة السابقة المحفوظة
    if (socket.currentChatId && socket.rooms.has(socket.currentChatId)) {
        socket.leave(socket.currentChatId); 
    }

    // الانضمام وحفظ معرف الغرفة الجديدة
    socket.join(newChatId); 
    socket.currentChatId = newChatId; 
    console.log(`User ${socket.user.id} switched to room: ${newChatId}`);
});
  socket.on('send_message', (data) => {
    const io = getSocketIo(); 
    const { newMessage } = data; 
    if (!newMessage || !newMessage.chat) {
      console.log('newMessage or newMessage.chat is undefined!', newMessage);
      return;
    }
 
    const chatId = newMessage.chat._id || newMessage.chat; 
    if (!chatId) return;

  
    socket.to(chatId).emit('message_received', newMessage); 


    io.to(chatId).emit('chat_updated', chatId); 
  });

  // Remove user from active users on disconnect
  socket.on("disconnect", () => {
  activeUsers.delete(socket.user.id);
  const usersList = Array.from(activeUsers.keys());
  console.log('Broadcasting activeUsers (after disconnect):', usersList);
  io.emit('activeUsers', usersList);
  });
});



// Database Connection
mongoose.connect(process.env.DB)
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err && err.message ? err.message : err);
  });

// Start Server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running and listening on port ${port}`);
});

server.on('error', (err) => {
  console.error('Server error:', err && err.message ? err.message : err);
});
