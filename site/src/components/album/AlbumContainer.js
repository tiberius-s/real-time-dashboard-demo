import React, { Component } from 'react';
import AlbumItem from './AlbumItem';
import './AlbumContainer.css';

class AlbumContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: []
    };

    this.socket = this.props.socket;
    this.socket.on('new-album', this.newAlbum);
  }

  newAlbum = (res) => {
    if (res.album.artist && res.album.album) {
      this.setState({
        content: this.state.content.concat({
          album: res.album
        })
      });
    }
  }

  render() {
    return (
      <div className="container" content={this.state.content}>
        {this.state.content.map((item, index) =>
          <AlbumItem key={index} item={item} />
        )}
      </div>
    );
  }
}

export default AlbumContainer;