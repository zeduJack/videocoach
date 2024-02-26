const express = require('express');
const https = require('https');
const fs = require('fs');
const socketIo = require('socket.io');

const options = {
  key: fs.readFileSync(__dirname + '/key.pem'),
  cert: fs.readFileSync(__dirname + '/cert.pem')
};

const app = express();
const server = https.createServer(options, app);
const io = socketIo(server);

app.get('/sender', (req, res) => {
  res.sendFile(__dirname + '/sender.html');
});

app.get('/', (req, res) => {
  res.writeHead(200);
  res.end('hello world\n');
});

app.get('/receiver', (req, res) => {
  res.sendFile(__dirname + '/receiver.html');
});

io.on('connection', socket => {
  console.log('A user connected');

  socket.on('create or join', room => {
    console.log('create or join to room ', room);
    const myRoom = io.sockets.adapter.rooms.get(room);
    const numClients = myRoom ? myRoom.size : 0;
    console.log(`The number of clients in the room ${room} is ${numClients}`);

    socket.join(room);
    socket.emit('joined room', room, { peerId: socket.id }); // Send back a unique ID for the peer
  });

  // Ensure 'offer', 'answer', and 'candidate' events include a peerId
  socket.on('offer', (data) => {
    // Broadcast the offer to the room excluding the sender
    socket.to(data.room).emit('offer', { peerId: socket.id, offer: data.offer });
  });

  socket.on('answer', (data) => {
    // Send the answer to the specific peer ID within the room
    socket.to(data.peerId).emit('answer', { peerId: socket.id, answer: data.answer });
  });

  socket.on('candidate', (data) => {
    // Send the candidate to the specific peer ID
    socket.to(data.peerId).emit('candidate', { peerId: socket.id, candidate: data.candidate });
  });
});

const PORT = process.env.PORT || 443;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
