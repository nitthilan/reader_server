// Modules
var restify = require("restify"),
    mongoose = require('mongoose'),
    fs = require('fs'),
    bunyan = require('bunyan');
// Create Logging for application
var logger = require('./log.js');
var log = logger.appLogger;

// Load configurations
var env = process.env.NODE_ENV || 'development' ,
    config = require('./config')[env];

// Paths
var models_path = config.root + '/lib/models'
var config_path = config.root + '/lib/config'

// Database
var connectStr = config.db_prefix +'://'+config.host+':'+config.db_port+'/'+config.db_name;
log.info(connectStr);
mongoose.connect(connectStr);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  log.info("Database connection opened.");
});

// Bootstrap models
fs.readdirSync(models_path).forEach(function (file) {
  log.info("Loading model " + file);
  require(models_path+'/'+file);
});

// Configure the server
var app = restify.createServer({
  //certificate: ...,
  //key: ...,
  name: 'crud-test',
    version: config.version,
    directory: config.static_path
});

// restify settings
require(config.root + './lib/rest/restify')(app, config, logger.restLogger);

// Bootstrap routes
var auth = require(config.root + './lib/middleware/authentication.js');

// configure email
//var MailHelper = require(config_path + '/mail-helper.js').MailHelper;
require(config.root + './lib/rest/routes.js')(app, config, auth);//, new MailHelper(config));

// configure Socket Server
//var SocketHelper_IO = require(config_path + '/socket-helper-socket-io.js').SocketHelper;
//new SocketHelper_IO(app, config);

// Init setting for application 
require(config.root + './lib/middleware/initialisation.js')(config);


// Start the app by listening on <port>
var port = process.env.PORT || config.port;
app.listen(port);
log.info('App started on port ' + port);

