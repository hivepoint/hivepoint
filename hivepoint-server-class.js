var express = require('express');
var path = require('path');
var http = require('http');

function HivepointServer() { }

HivepointServer.prototype.initialize = function(config, callback) {
  this.config = config;  
};

HivepointServer.prototype.start = function(callback) {
  var maxAge = 86400000;
  if (this.config.client.maxAge) {
    maxAge = this.config.client.maxAge;
  }
  this.clientApp = express();
  this.clientApp.use(express.static(path.join(__dirname, 'public'), {
    maxAge: maxAge,
    etag: false
  }));
  this.clientServer = http.createServer(this.clientApp);
  this.clientServer.listen(this.config.client.port, function(err) {
    console.log("Listening for client connections on port " + this.config.client.port);
    setTimeout(callback, 10);
  }.bind(this));
};


module.exports = HivepointServer;