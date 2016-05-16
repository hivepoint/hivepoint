#!/usr/bin/env node

var Server = require("./hivepoint-server-class");

function start() {
  var server = new Server();
  server.start(function(err) {
    if (err) {
      console.log("Error starting: " + err);
      process.exit();
    }
  });
}

start();