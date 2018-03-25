const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const { generateMessage } = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

// listen to new connection
io.on('connection', socket => {
  console.log('User has connected');

  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat'));

  socket.broadcast.emit(
    'newMessage',
    generateMessage('Admin', 'New user joined')
  );

  socket.on('createMessage', message => {
    console.log('createMessage', message);
    /* io emits event to all available connection
       while socket emits to a single connection */
    io.emit('newMessage', generateMessage(message.from, message.text));
  });

  socket.on('disconnect', socket => {
    console.log('User has disconnected');
  });
});

server.listen(3000, () => console.log('Running'));
