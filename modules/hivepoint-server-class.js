var express = require('express');
var path = require('path');
var http = require('http');
var async = require('async');
var compress = require('compression');
var config = require('./config');
var url = require('url');

var rootPageHandler = require('./root-page-handler');

function HivepointServer() { }

HivepointServer.prototype.initialize = function(callback) {
  this.version = Date.now();
  this.serverStatus = 'starting';
  this.staticBase = "/v" + config.data.version;

  var steps = [];
  steps.push(function(callback) {
    rootPageHandler.initialize(callback);
  }.bind(this));
  steps.push(function(callback) {
    this._startServer(callback);
  }.bind(this));
  async.waterfall(steps, function(err) {
    if (err) {
      console.error("Server startup error", err);
      process.exit();
    }
    this.serverStatus = "OK";
    console.log("Server started successfully");
    callback();
  }.bind(this));  
};

HivepointServer.prototype._startServer = function (callback) {
  var maxAge = 86400000;
  if (config.data.client.maxAge) {
    maxAge = config.data.client.maxAge;
  }
  this.clientApp = express();
  this.clientApp.use(compress());
  
  rootPageHandler.initializeApp(this.clientApp, this);

  this.clientApp.get('/ping', function (request, response) {
    this.handlePingRequest(request, response);
  }.bind(this));
  this.clientApp.use(this.staticBase, express.static(path.join(__dirname, '../public'), {
    maxAge: 1000 * 60 * 60 * 24 * 7
  }));

  this.clientServer = http.createServer(this.clientApp);
  this.clientServer.listen(config.data.client.port, function (err) {
    console.log("Listening for client connections on port " + config.data.client.port);
    setTimeout(callback, 10);
  }.bind(this));
};

HivepointServer.prototype.handlePingRequest = function(request, response) {
  response.setHeader('Content-Type', 'application/json');
  response.setHeader('Cache-Control', 'no-cache, no-store, max-age=0, must-revalidate');
  var result = {
    product: 'HivePoint',
    status: 'OK'
  };
  response.send(JSON.stringify(result));
};

HivepointServer.prototype.resolveStaticUrl = function(value) {
 var baseUrl = url.resolve(config.data.baseClientUri, this.staticBase + "/");
 return url.resolve(baseUrl, value);
};

var server = new HivepointServer();

module.exports = server;