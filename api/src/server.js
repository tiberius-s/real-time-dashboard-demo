import express from 'express';
import http from 'http';
import socketio from 'socket.io';
import socketMW from './middleware/socket';
import headers from './middleware/headers';
import album from './randomAlbum';

// Initialize
const app = express();
const server = http.Server(app);
const io = socketio.listen(server);
const socket = socketMW(io);

const PORT = 8080;

app.use(socket);
app.use(headers);

app.get('/', (req, res, next) => {
  if (err) next(err);
  req.io.emit('greeting', { message: 'Hello, Audience!' });
  res.json({ message: "You touched the api root directory" })
})

// Server
server.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));

// Socket Connection
io.on('connection', function (socket) {
  setInterval(() => {
    album.getRandomAlbum().then(data => {
      socket.emit('new-album', { album: data });
    });
  }, 3000);
});