import artists from './data/artists.json';
import https from 'https';

// Basic Http Get Call wrapper
function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      if (res.statusCode !== 200) {
        return new Error('response status code not 200');
      }
      let data = '';
      res.setEncoding('utf8');
      res.on('data', chunk => data += chunk);
      res.on('end', () => { resolve(JSON.parse(data)) })
    })
      .on('error', err => { reject(err) });
  })
}

//  Filters
const artistFilter = name => {
  return artist => {
    if (artist.name === name) {
      return artist;
    }
  }
}

const albumFilter = artistId => {
  return album => {
    if (album.available_markets.indexOf('US') > -1 && album.artists[0].id === artistId) {
      delete album.available_markets;
      return album;
    }
  }
}

function getArtist() {
  let random = Math.floor((Math.random() * artists.length + 1));
  let artist = artists[random];
  let encodedArtist = encodeURIComponent(artist);
  let url = `https://api.spotify.com/v1/search?q=artist:${encodedArtist}&type=artist`
  return get(url).then(res => res.artists.items.filter(artistFilter(artist)).map(artist => artist.id).pop());
}

function getAlbums(artistId) {
  let url = `https://api.spotify.com/v1/artists/${artistId}/albums`
  return get(url).then(res => res.items.filter(albumFilter(artistId)));
}

function pickRandomAlbum(result) {
  if (result.length > 0) {
    let randomAlbum = Math.floor((Math.random() * result.length));
    let imgSrc = result[randomAlbum].images[1].url;
    let artist = result[randomAlbum].artists[0].name;
    return { artist: artist, album: imgSrc };
  }
  return false;
}

const getRandomAlbum = () => getArtist().then(getAlbums).then(pickRandomAlbum);

// Export the album fetcher
module.exports = {
  getRandomAlbum: getRandomAlbum
}