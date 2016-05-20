var fs = require('fs');

function Config() {

}

Config.prototype.initialize = function(configPath, options, callback) {
  console.log("Reading configuration from " + configPath);
  fs.readFile(configPath, 'utf8', function(err, data) {
    if (err) {
      console.log(err);
      process.exit();
    }
    this.data = JSON.parse(data);
    if (options.version) {
      this.data.version = options.version;
    }
    if (options.domain) {
      this.data.domain = options.domain;
    }
    if (this.data.mongo && this.data.mongo.mongoUrl) {
      this.data.mongo.mongoUrl = this.data.mongo.mongoUrl.split("{domain}").join(this.data.domain.split(".").join("_"));
    }
    callback();
  }.bind(this));
};

var config = new Config();

module.exports = config;
