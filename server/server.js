const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

// listen to new connection
io.on('connection', socket => {
  console.log('User has connected');

  socket.emit('newMessage', {
    from: 'Admin',
    text: 'Welcome to the chat'
  });

  socket.broadcast.emit('newMessage', {
    from: 'Admin',
    text: 'New user joined',
    createdAt: new Date().getTime()
  });

  socket.on('createMessage', message => {
    console.log('createMessage', message);

    /* io emits event to all available connection
       while socket emits to a single connection */

    io.emit('newMessage', {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    });

    // broadcasting emits to everyone but the one who send it
    // socket.broadcast.emit('newMessage', {
    //   from: message.from,
    //   text: message.text,
    //   craeted: new Date().getTime()
    // });
  });

  socket.on('disconnect', socket => {
    console.log('User has disconnected');
  });
});

server.listen(3000, () => console.log('Running'));
