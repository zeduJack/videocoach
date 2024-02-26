const express = require('express');
const https = require('https');
const fs = require('fs');
const socketIo = require('socket.io');
const os = require('os');

console.log('key', __dirname + '/key.pem');

const options = {
  key: fs.readFileSync(__dirname + '/key.pem'),
  cert: fs.readFileSync(__dirname + '/cert.pem')
};

const app = express();
const server = https.createServer(options, app);
const io = socketIo(server);

// Serve your static HTML files
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
    room = '0';
    console.log('create or join to room ', room);
    //const myRoom = io.sockets.adapter.rooms[room] || { length: 0 };
    console.log('rooms', io.sockets.adapter.rooms);
    const myRoom = io.sockets.adapter.rooms.get(room);
    console.log('room', myRoom);

    const numClients = myRoom ? myRoom.size : 0;
    console.log(`The number of clients in the room ${room} is ${numClients}`);

    console.log(room, ' has ', numClients, ' clients');

    if (numClients === 0) {
      console.log('creating room...');
      socket.join(room);
      socket.emit('join room', room);
    } else {
      console.log('joining room...');
      socket.join(room);
      socket.emit('join room', room);
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

function getLocalIPv4Address() {
    const interfaces = os.networkInterfaces();
    for (const iface of Object.values(interfaces)) {
        for (const alias of iface) {
            if (alias.family === 'IPv4' && !alias.internal) {
                return alias.address;
            }
        }
    }
    return '0.0.0.0'; // Fallback to listening on all interfaces if a specific local IP is not found
}
const hostname = getLocalIPv4Address();
console.log(`Your local IPv4 address is: https://${hostname}`);
console.log(`Receiver on: https://${hostname}/receiver`);

const PORT = process.env.PORT || 443;
server.listen(PORT ,() => {
  console.log(`Server listening on port ${PORT}`);
});
