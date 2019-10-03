# Real-time Dashboard Demo

## Why? How?

I was asked to present a technical demo for my co-workers. Given that I'd been playing with Socket.IO recently, I figured it would be a good idea to demonstrate how it's possible to make a real-time dashboard that updates on events.

Since Spotify does not, to my knowledge, have a method to return a random artist, I decided to spoof this by making an array of the artists I'd listened to or saved in the past couple years. Whenever `getRandomAlbum()` is called, we pick an artist from said array, and query the Spotify API to retrieve all the albums associated with the artist. We then pick one of those at random, and return an object that contains the artist name and album art image url. `randomAlbum.js` contains the API call,data formatting, and exports a single function that will be user in the main, `server.js`.

In `server.js`, `getRandomAlbum` is called ever 3 seconds and emits the data as well as a `new-album` event. The front-end will have a socket client listener that will capture said event and handle the data called. Socket is a singleton on the App, but can be passed down to child components so they can handle specific events ...and for cleaner code. In our case, we have the socket listening on the main app file for a `greeting` event, and we pass it on to the AlbumContainer to handle the `new-album` event. Whenever a new album is broadcast, AlbumContainer will add it to the state object, and in turn create a new child component.

Additionally, I added an event emmitter on an endpoint, in this case the server root "/". This event is not triggered by the site accessing the socket instance on the server at the same address, instead only when that route is hit. This is to show how to implement a socket event when hitting a certain route. One important detail is to ensure that you attach the socket.io instance to the app, I did this with a middleware function.

## Instructions

### This used to work straight out of the box. However, Spotify now requires a token to interact with the APi.

1. Go to [https://developer.spotify.com/dashboard/](https://developer.spotify.com/dashboard/) and create a client.
2. In the `api` folder, add a `.env` file and make sure the CLIENT_ID and CLIENT_SECRET are in place.
   - Example entry: `CLIENT_ID="YOUR CLIENT ID"`
3. From the root directory, run `docker-compose up -d`.
4. Open the browser to [http://localhost:10002](http://localhost:10002) to see the site. The Api runs on [http://localhost:10001](http://localhost:10001)
5. To stop the containers, run `docker-compose down`

Additionally, there is an option to run these apps in dev mode, which will autoreload front or back end as modified. For this to work, you will need to run `npm install` in both `api` and `site` directories. Once that's done, change directory to project root and enter `docker-compose -f docker-compose-dev.yml up`.

## Stack

- Front end

  - [React](https://facebook.github.io/react)
  - [Socket.IO](https://socket.io)

- Back end
  - [Babel](https://babeljs.io)
  - [Node](https://nodejs.org)
  - [Express](https://expressjs.com)
  - [Socket.IO](https://socket.io)

---

## Tools used to put this together

- [create-react-app](https://github.com/facebookincubator/create-react-app)
- [Spotify API](https://developer.spotify.com/web-api/)
- [Visual Studio Code](https://code.visualstudio.com)
- [Docker](https://docker.io/)
- [git](https://git-scm.com/)

---

## TODO

- Expand readme to explain the steps taken
- Both, front end and back end folders will need their own readme to explain the method to the madness
- convert back end to ES6
- filter out that karaoke album nonsense
