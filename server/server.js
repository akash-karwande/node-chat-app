const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');



const publicPath = path.join(__dirname, '../public');
var port = process.env.PORT || 3000;
var app = express();

var server = http.createServer(app);

var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('createMessage', (message) => {
        console.log('createMessage', message);

        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        });
    });

    socket.on('disconnect', () => {
        console.log('user is disconnected');
    });
});


server.listen(3000, () => {
    console.log(`started up at port ${port}`);
});