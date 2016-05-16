var express = require('express');
var path = require('path');
var http = require('http');

function HivepointServer() { }

HivepointServer.prototype.start = function(callback) {
  var clientPort = 31112;
  this.clientApp = express();
  this.clientApp.use(express.static(path.join(__dirname, 'public'), {
    maxAge: 86400000,
    etag: false
  }));
  this.clientServer = http.createServer(this.clientApp);
  this.clientServer.listen(clientPort, function(err) {
    console.log("Listening for client connections on port " + clientPort);
    setTimeout(callback, 10);
  }.bind(this));
};


module.exports = HivepointServer;