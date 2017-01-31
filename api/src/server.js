'use strict';

// Initialize
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io').listen(server);
const socket = require('./middleware/socket')(io);
const headers = require('./middleware/headers');
const album = require('./randomAlbum');
const PORT = 8080;

app.use(socket);
app.use(headers);

app.get('/', (req, res) => {
  req.io.emit('greeting', { message: 'Hello, Audience!' });
})

// Server
server.listen(PORT, () => {
  console.log('Running on http://localhost:' + PORT);
});

// Socket Connection
io.on('connection', function (socket) {
  setInterval(() => {
    album.getRandomAlbum().then(data => {
      socket.emit('new-album', { album: data });
      console.info({ album: data });
    });
  }, 3000);
});