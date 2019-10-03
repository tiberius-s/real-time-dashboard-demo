'use strict';

// Initialize
const express = require('express');
const app = express();
const server = require('http').Server(app);
const PORT = 3000;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use(express.static('build'));

// Server
server.listen(PORT, () => {
  console.log('See the UI at http://localhost:10002');
});
