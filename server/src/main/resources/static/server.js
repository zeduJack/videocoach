const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve your static HTML files
app.get('/sender', (req, res) => {
  res.sendFile(__dirname + '/sender.html');
});

app.get('/receiver', (req, res) => {
  res.sendFile(__dirname + '/receiver.html');
});

io.on('connection', socket => {
  console.log('A user connected');

  socket.on('create or join', room => {
    console.log('create or join to room ', room);
    const myRoom = io.sockets.adapter.rooms[room] || { length: 0 };
    const numClients = myRoom.length;

    console.log(room, ' has ', numClients, ' clients');

    if (numClients === 0) {
      socket.join(room);
      socket.emit('created', room);
    } else if (numClients === 1) {
      socket.join(room);
      socket.emit('joined', room);
    } else {
      socket.emit('full', room);
    }
  });

  socket.on('offer', (room, offer) => {
    socket.to(room).emit('offer', offer);
  });

  socket.on('answer', (room, answer) => {
    socket.to(room).emit('answer', answer);
  });

  socket.on('candidate', (room, candidate) => {
    socket.to(room).emit('candidate', candidate);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
