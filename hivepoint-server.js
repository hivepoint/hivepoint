#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var cliArgs = require("command-line-args");

var Server = require("./hivepoint-server-class");


function start() {
  /* define the command-line options */
  var cli = cliArgs([{
    name: "help",
    alias: "h",
    type: Boolean,
    description: "Print usage instructions"
  }, {
      name: "config",
      alias: "c",
      type: String,
      description: "Path to a configuration file (based on config.json)"
    }]);

  /* parse the supplied command-line values */
  var options = cli.parse();

  /* generate a usage guide */
  var usage = cli.getUsage({
    header: "HivePoint",
    footer: "For more information, visit http://hivepoint.com"
  });

  if (options.help) {
    console.log(usage);
    process.exit();
  }

  var configPath = path.join(__dirname, 'config.json');
  if (options.config) {
    configPath = options.config;
  }
  console.log("Reading configuration from " + configPath);
  fs.readFile(configPath, 'utf8', function (err, data) {
    if (err) {
      console.log(err);
      process.exit();
    }
    var config = JSON.parse(data);
    if (options.domain) {
      config.domain = options.domain;
    }
    console.log("HivePoint server initializing");
    console.log("Configuration", config);
    var server = new Server();
    server.initialize(config);
    server.start(function (err) {
      if (err) {
        console.log("Error starting: " + err);
        process.exit();
      }
    });
  });
}

start();