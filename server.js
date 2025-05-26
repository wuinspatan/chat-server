const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

// 🧠 Store messages in memory
const chatHistory = [];

io.on('connection', (socket) => {
  // Send full chat history to new user
  socket.emit('chat history', chatHistory);

  socket.on('set username', (username) => {
    socket.username = username;
    console.log(`${username} connected`);

    const systemMessage = {
      name: 'System',
      message: `${username} joined the chat`
    };

    chatHistory.push(systemMessage); // Save join message
    io.emit('chat message', systemMessage);
  });

  socket.on('chat message', (msg) => {
    const sender = socket.username || 'Anonymous';
    const chatMessage = { name: sender, message: msg };

    chatHistory.push(chatMessage); // Save message
    io.emit('chat message', chatMessage);
  });

  socket.on('disconnect', () => {
    console.log(`${socket.username || 'A user'} disconnected`);
  });
});

const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
