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


    socket.emit('newMessage', {
        from: "akash@gmail.com",
        text: "testing",
        createdAt: 123
    });

    socket.on('createMessage', (message) => {
        console.log('createMessage', message);
    });

    socket.on('disconnect', () => {
        console.log('user is disconnected');
    });
});


server.listen(3000, () => {
    console.log(`started up at port ${port}`);
});