import React, { Component } from 'react';
import './Header.css';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      greeting: props.greeting
    }
  }

  componentWillReceiveProps(newProps) {
    this.setState({ greeting: newProps.greeting });
  }

  render() {
    let message = this.state.greeting.message;
    return (
      <div className="header">
        <div className="header-title">
          Random Album Art
        </div>
        <div className="header-info">
          - A simple implementation of an event listener using Node, React, Socket.IO and the Spotify API
        </div>
        <div className="header-message">
          { (message !== undefined) ? message : ''}
        </div>
      </div>
    );
  }
}

export default Header;