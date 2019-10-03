const fs = require('fs');
const axios = require('axios');
const qs = require('querystring');
const artists = require('./data/artists.json');

const SPOTIFY_TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token/';
const SPOTIFY_API_BASE = 'https://api.spotify.com/v1/';

//  Filters
const artistFilter = name => artist => {
  if (artist.name.toLowerCase().trim() === name.toLowerCase().trim()) {
    return artist;
  }
};

const albumFilter = artistId => album => {
  if (album.artists[0].id === artistId) {
    return album;
  }
};

// Functions
const unixCurrentTime = () => Math.floor(new Date().getTime() / 1000);

const encodeBasicAuth = (id, pw) => Buffer.from(`${id}:${pw}`).toString('base64');

function getCredentials() {
  const authString = encodeBasicAuth(process.env.CLIENT_ID, process.env.CLIENT_SECRET);
  const config = {
    method: 'POST',
    url: SPOTIFY_TOKEN_ENDPOINT,
    data: qs.stringify({ grant_type: 'client_credentials' }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${authString}`
    }
  };
  return axios(config).then(res => res.data);
}

function saveCredentials(data) {
  const processResponse = data => Object.assign(data, { saveTime: unixCurrentTime() });
  return new Promise((resolve, reject) => {
    fs.writeFile('credentials.json', JSON.stringify(processResponse(data), null, 2), err => {
      if (err) reject(err);
      console.log('Saved new credentials!');
      resolve();
    });
  });
}

function getToken() {
  let creds;
  try {
    creds = JSON.parse(fs.readFileSync('./credentials.json'));
  } catch (e) {
    creds = false;
  }
  if (!creds || unixCurrentTime() >= creds.saveTime + creds.expires_in) {
    return getCredentials()
      .then(saveCredentials)
      .then(() => getToken())
      .catch(printError);
  }
  return creds.access_token;
}

async function getRandomArtist() {
  const random = Math.floor(Math.random() * artists.length + 1);
  const artist = artists[random];
  const config = {
    method: 'GET',
    url: `${SPOTIFY_API_BASE}search?q=${encodeURIComponent(artist)}&type=artist&market=us`,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${await getToken()}`
    }
  };

  return axios(config)
    .then(res => res.data.artists.items.filter(artistFilter(artist)).map(artist => artist.id)[0])
    .catch(printError);
}

async function getAlbums(artistId) {
  const config = {
    method: 'GET',
    url: `${SPOTIFY_API_BASE}artists/${artistId}/albums?market=us`,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${await getToken()}`
    }
  };
  return axios(config)
    .then(res => res.data.items.filter(albumFilter(artistId)))
    .catch(printError);
}

function pickRandomAlbum(albums) {
  if (albums.length > 0) {
    let random = Math.floor(Math.random() * albums.length);
    let imgSrc = albums[random].images[1].url;
    let artist = albums[random].artists[0].name;
    return { artist: artist, album: imgSrc };
  }
  return false;
}

function getRandomAlbum() {
  return getRandomArtist()
    .then(getAlbums)
    .then(pickRandomAlbum)
    .catch(printError);
}

function printError(err) {
  console.log('Error:', err);
}

// Export the album fetcher˜
module.exports = {
  getRandomAlbum: getRandomAlbum
};
