var mongoose = require('mongoose');
var fs = require('fs');
module.exports = function(config){
  var User = mongoose.model('User');
  // Drop the User table
  User.remove({}, function(err) { 
    console.log('collection removed '+err) ;
    // Create a user into the table
    var user = new User();
    user.name = 'nitthilan';
    user.email = 'nitthilan@gmail.com';
    user.username = 'nitthilan';
    user.role = 'User';
    user.password = 'nitthilan';
    user.save();
  });
  // initialise the subscription 
  var sub = require(config.root + './lib/middleware/subscription.js');
  //fs.readFile(config.root+'./subscription/subscriptions.xml',sub.read);
}
