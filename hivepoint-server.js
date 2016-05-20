#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var cliArgs = require("command-line-args");
var config = require('./modules/config');

var server = require("./modules/hivepoint-server-class");

var VERSION = 2;

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
  
  if (!options.version) {
    options.version = VERSION;
  }

  var configPath = path.join(__dirname, 'modules/config.json');
  if (options.config) {
    configPath = options.config;
  }

  config.initialize(configPath, options, function() {
    console.log("HivePoint server initializing");
    server.initialize(function (err) {
      if (err) {
        console.log("Error starting: " + err);
        process.exit();
      }
    });
  });
}

start();