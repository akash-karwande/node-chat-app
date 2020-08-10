const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const { generateMessage}  = require('./utils/message');



const publicPath = path.join(__dirname, '../public');
var port = process.env.PORT || 3000;
var app = express();

var server = http.createServer(app);

var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to chat app'));

    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

    socket.on('createMessage', (message, callback) => {
        console.log('createMessage', message);

        io.emit('newMessage', generateMessage(message.from, message.text));

        callback("server message call back");
    });

    socket.on('disconnect', () => {
        console.log('user is disconnected');
    });
});


server.listen(3000, () => {
    console.log(`started up at port ${port}`);
});