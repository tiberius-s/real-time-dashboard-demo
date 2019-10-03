require('dotenv').config();
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io').listen(server);

const socket = require('./middleware/socket')(io);
const headers = require('./middleware/headers');
const album = require('./randomAlbum');
const PORT = 8080;

// Server
server.listen(PORT, () => console.log('API server is running and mapped to http://localhost:10001'));

app.use(headers);
app.use(socket);

app.get('/', (req, res) => {
  req.io.emit('greeting', { message: 'Hello, Audience!' });
  res.json({ message: 'You touched the api root directory' });
});

// Socket Connection
io.on('connection', function(socket) {
  setInterval(() => {
    album.getRandomAlbum().then(data => socket.emit('new-album', { album: data }));
  }, 3000);
});
