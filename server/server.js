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
    from: 'example@example.com',
    text: 'This is example',
    createdAt: 222
  });

  socket.on('createMessage', message => {
    console.log('createMessage', message);
  });

  socket.on('disconnect', socket => {
    console.log('User has disconnected');
  });
});

server.listen(3000, () => console.log('Running'));
