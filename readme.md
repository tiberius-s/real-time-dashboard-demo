# Real-time Dashboard Demo

## Why? How?

I was asked to present a technical demo for my co-workers. Given that I'd been playing with Socket.IO recently, I figured it would be a good idea to demonstrate how it's possible to make a real-time dashboard that updates on events.

Since Spotify does not, to my knowledge, have a method to return a random artist, I decided to spoof this by making an array of the artists I'd listened to or saved in the past couple years. Whenever `getRandomAlbum()` is called, we pick an artist from said array, and query the Spotify API to retrieve all the albums associated with the artist. We then pick one of those at random, and return an object that contains the artist name and album art image url. `randomAlbum.js` contains the API call,data formatting, and exports a single function that will be user in the main, `server.js`.

In `server.js`, `getRandomAlbum` is called ever 3 seconds and emits the data as well as a `new-album` event. The front-end will have a socket client listener that will capture said event and handle the data called. Socket is a singleton on the App, but can be passed down to child components so they can handle specific events ...and for cleaner code. In our case, we have the socket listening on the main app file for a `greeting` event, and we pass it on to the AlbumContainer to handle the `new-album` event. Whenever a new album is broadcast, AlbumContainer will add it to the state object, and in turn create a new child component.

Additionally, I added an event emmitter on an endpoint, in this case the server root "/". This event is not triggered by the site accessing the socket instance on the server at the same address, instead only when that route is hit. This is to show how to implement a socket event when hitting a certain route. One important detail is to ensure that you attach the socket.io instance to the app, I did this with a middleware function.

## Stack

* Front end
  * React
  * Socket.IO

* Back end
  * Node
  * Express
  * Socket.IO
  * Babel

---
## Tools used to put this together

* [create-react-app](https://github.com/facebookincubator/create-react-app)
* [Spotify API](https://developer.spotify.com/web-api/)
* [Visual Studio Code](code.visualstudio.com)
* git
* [Docker](http://docker.io/) (soon)

---
## TODO

* Dockerize this demo into a multi-container app
* Expand readme to explain the steps taken
* Both, front end and back end folders will need their own readme to explain the method to the madness
* convert back end to ES6
* filter out that karaoke album nonsense