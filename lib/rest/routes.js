
var restify = require('restify')
, fs = require('fs')
, mongoose = require('mongoose');

module.exports = function (app, config, auth){ //, smtpTransport) {
    // Is application alive ping
    app.get('/api', function (req, res) {
      //console.log(req);
      res.send({'message':'Success'});
    });

  //
  // I looked at header based API versioning, not a fan, but also when I tried this, the atatic resource GETs hang
  //    app.get({path : '/db', version : '1.0.0'}, ...
  //    app.get({path : '/db', version : '2.0.0'}, ...

  // Is database alive ping
  app.get('/db', function (req, res) {
    var result = '';
    mongoose.connection.db.executeDbCommand({'ping':'1'}, function(err, dbres) {
      if (err === null) {
        res.send(dbres);
      } else {
        res.send(err);
      }
    });
  });

  var route_path = config.root + './lib/rest/';
  //require(config_path + '/routes-user.js')(app, config, smtpTransport);
  //require(config_path + '/routes-email.js')(app, config, smtpTransport);
  require(route_path + 'routes_auth.js')(app, config, auth);
  require(route_path + 'routes_subscription.js')(app, auth, "/reader", config);
  //require(config_path + '/routes-subscription.js')(app);
}

