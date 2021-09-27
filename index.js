const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

var incr = 1;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  // when a user enters, emits connection msg
  socket.broadcast.emit('enter', 'a new user has connected.');

  // grants users guest name as default
  socket.emit('name', "guest"+incr);
  incr++;

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  // when a user leaves, emits disconnection msg
  socket.on('disconnect', () => {
    socket.broadcast.emit('leave', 'a user has disconnected.');
    incr--;
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});