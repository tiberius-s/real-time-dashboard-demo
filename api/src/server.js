'use strict';

// Initialize
const app = require('express')();
const https = require('https');
const server = require('http').Server(app);
const io = require('socket.io').listen(server);
const artists = require('./data/artists');
const socket = require('./middleware/socket')(io);
const headers = require('./middleware/headers');
const PORT = 8080;

app.use(socket);
app.use(headers);

// Basic Http Get Call wrapper
function httpGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        return new Error('response status code not 200');
      }
      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => rawData += chunk);
      res.on('end', () => {
        let data = JSON.parse(rawData);
        resolve(data);
      })
    }).on('error', (err) => { reject(err) });
  })
}

// Functions to handle the API calls
function randomArtist() {
  let random = Math.floor((Math.random() * artists.length + 1));
  let artist = artists[random];
  return getAllAlbums(artist).then(data => {
    let imgSrc = getRandomAlbumArt(data);
    if (imgSrc !== undefined) {
      return { artist: artist, album: imgSrc };
    }
  });
}

function getAllAlbums(artist) {
  let encodedArtist = encodeURIComponent(artist);
  let url = `https://api.spotify.com/v1/search?q=${encodedArtist}&type=album`;
  return httpGet(url);
}

function getRandomAlbumArt(result) {
  if (result.albums.items.length > 0) {
    let randomImg = Math.floor((Math.random() * result.albums.items.length));
    return result.albums.items[randomImg].images[1].url;
  }
  return false;
}

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
    randomArtist().then(data => {
      socket.emit('new-album', { album: data })
      console.log({ album: data });
    });
  }, 3000);
});