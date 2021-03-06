var mongoose = require('mongoose')
, User = mongoose.model('User')
, restify = require('restify');

module.exports = function (app, config, auth) {
  // Return the available roles
  function roles(req, res, next) {
    res.send(['User', 'Subscriber','Admin']);
  }

  //Callback for response of asyn call
  function createLoginReponse(req, res, next){
    return function(err, user){
      if (err) { 
        req.session.reset();
        res.send(403, err);
        return next();
      }
      else if (!user) {
        req.session.reset();
        res.send(403, new Error('Unknown user'));
      }
      else if (user.authenticate(req.params.password)) {
        req.session.user = user._id;
        res.send(user);
      } else {
        req.session.reset();
        res.send(403, new Error('Invalid password'));
      }
      return next();
    }
  }

  // API function
  // Search by Username
  function login(req, res, next) {
    var query = User.where( 'username', new RegExp('^'+req.params.username+'$', 'i') );
    query.findOne(createLoginReponse(req, res, next));
  }

  function logout(req, res, next) {
    req.session.reset();
    res.send({});
  }

  // Set up routes 

  // Ping but with user authentication
  app.get('/api/auth', auth.requiresLogin, function (req, res) {
    res.send({'message':'Success'});
  });

  // Login
  app.post('/api/v1/session/login', login);
  // Logout
  app.get('/api/v1/session/logout', logout);

  // Get the available roles
  app.get('/api/v1/roles', roles);

  // Check user access
  app.get('/api/v1/roles/access', auth.access, function (req, res) {
    res.send({'message':'Success'});
  });
}



