import React, { Component } from 'react';
import './App.css';
import io from 'socket.io-client';
import Header from './components/header/Header';
import AlbumContainer from './components/album/AlbumContainer';

const server = process.env.REACT_APP_API_HOST;
console.log('server', process.env.REACT_APP_API_HOST);
const socket = io.connect(server || 'localhost:8080');

class App extends Component {
  constructor() {
    super();
    this.state = {
      greeting: {}
    };
    socket.on('greeting', this.greeting);
  }

  greeting = data => this.setState({ greeting: data });

  render() {
    return (
      <div className="App">
        <Header greeting={this.state.greeting} />
        <AlbumContainer socket={socket} />
      </div>
    );
  }
}

export default App;
