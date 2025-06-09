const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

const chatHistory = [];

io.on('connection', (socket) => {
  socket.emit('chat history', chatHistory);

  socket.on('set username', (username) => {
    socket.username = username;
    console.log(`${username} connected`);

    const systemMessage = {
    name: 'System',
    message: `${username} joined the chat`,
    time: Date.now()
    };

    chatHistory.push(systemMessage); 
    io.emit('chat message', systemMessage);
  });

  socket.on('chat message', (msg) => {
    const sender = socket.username || 'Anonymous';
    const chatMessage = {
      name: sender,
      message: msg,
      time: Date.now()
    };
  
    chatHistory.push(chatMessage);
    io.emit('chat message', chatMessage);
  });

  socket.on('disconnect', () => {
    console.log(`${socket.username || 'A user'} disconnected`);
  });
});

const PORT = 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}`);
});