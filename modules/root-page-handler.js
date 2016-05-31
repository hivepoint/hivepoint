var fs = require('fs');
var path = require('path');
var Mustache = require('mustache');

var config = require('./config');

function RootPageHandler() {

}

RootPageHandler.prototype.initialize = function(callback) {
  var indexPath = path.join(__dirname, 'templates/index.html');
  console.log("Reading index.html prototype from " + indexPath);
  fs.readFile(indexPath, 'utf8', function(err, data) {
    if (err) {
      console.error("Error reading index.html");
    } else {
      this.indexContent = data;
      callback();
    }
  }.bind(this));
};

RootPageHandler.prototype.initializeApp = function(app, server) {
  this.server = server;
  app.get('/', function(request, response) {
    this._handleRootPageRequest(app, server, request, response);
  }.bind(this));
  app.get('/index.html', function(request, response) {
    this._handleRootPageRequest(app, server, request, response);
  }.bind(this));
};

RootPageHandler.prototype._handleRootPageRequest = function(app, server, request, response) {
  response.setHeader('Content-Type', 'text/html');
  response.setHeader('Cache-Control', 'no-cache, no-store, max-age=0, must-revalidate');
  // if (!config || !config.data || !config.data.client || config.data.client && !config.data.client.noCaching) {
  //   var maxAge = 60 * 10;
  //   if (config && config.data && config.data.client && config.data.client.rootMaxAge) {
  //     response.setHeader('Cache-Control', 'public, max-age=' + config.data.client.rootMaxAge);      
  //   }
  // }

  var ogType = 'website';
  var ogUrl = config.data.baseClientUri;

  var og = {
    title: "HivePoint",
    description: "Experts in User Interface Interactivity",
    image: server.resolveStaticUrl("images/hivepoint.jpg"),
    imageWidth: 750,
    imageHeight: 750
  };
  var ogHeaders = '<meta property="og:title" content="' + og.title + '" />\n';
  ogHeaders += '<meta property="og:description" content="' + og.description + '" />\n';
  ogHeaders += '<meta property="og:type" content="' + ogType + '" />\n';
  ogHeaders += '<meta property="og:url" content="' + ogUrl + '" />\n';
  ogHeaders += '<meta property="og:image" content="' + og.image + '" />\n';
  ogHeaders += '<meta property="og:image:width" content="' + og.imageWidth + '" />\n';
  ogHeaders += '<meta property="og:image:height" content="' + og.imageHeight + '" />\n';

  // Twitter card
  ogHeaders += '<meta name="twitter:card" content="summary">\n';
  ogHeaders += '<meta name="twitter:site" content="@HivePoint">\n';
  ogHeaders += '<meta name="twitter:title" content="' + og.title + '">\n';
  ogHeaders += '<meta name="twitter:description" content="' + og.description + '">\n';
  ogHeaders += '<meta name="twitter:image" content="' + og.image + '">\n';
  ogHeaders += '<meta name="twitter:image:width" content="' + og.imageWidth + '">\n';
  ogHeaders += '<meta name="twitter:image:height" content="' + og.imageHeight + '">\n';

  var otherScripts = "";
  var userAgent = request.headers['user-agent'];
  if (userAgent) {
    var isIe = (userAgent.indexOf('MSIE') > -1) || (userAgent.indexOf('Trident') > -1);
    if (isIe) {
      // otherScripts = "<script src=\"promise.min.js\"></script>";
    }
  }

  var view = {
    static_base: this.server.staticBase,
    ogdata: ogHeaders,
    other_scripts: otherScripts
  };

  var output = Mustache.render(this.indexContent, view);

  response.send(output);
};

var rootPageHandler = new RootPageHandler();

module.exports = rootPageHandler;