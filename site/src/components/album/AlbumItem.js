import React, { Component } from 'react';
import './AlbumItem.css';

class AlbumItem extends Component {
  render() {
    let album = this.props.item.album;
    return (
      <div className="album">
        <img src={album.album} alt="Missing" />
        <div className="artist">
          {album.artist}
        </div>
      </div>
    );
  }
}

export default AlbumItem;