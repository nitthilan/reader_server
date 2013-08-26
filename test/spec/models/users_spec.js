describe("Validating User Schema",function(){
  it('Storing a User schema',function(){
    var mongoose = require('mongoose');
    var config = require('../../../lib/config.js')['development'];
    var connectStr = config.db_prefix +'://'+config.host+':'+config.db_port+'/'+config.db_name;
    Schema = mongoose.Schema;
    ObjectId = Schema.ObjectId;
    console.log(connectStr);
    mongoose.connect(connectStr);
    var db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function callback () {
      console.log("Database connection opened.");
    });


    require(config.root+'./lib/models/users.js');
    var User = mongoose.model('User');
    var user = new User();
    user.name = 'nitthilan';
    user.email = 'nitthilan@gmail.com';
    user.username = 'nitthilan';
    user.role = 'User';
    user.password = 'nitthilan';

    user.save();
    var query = User.where( 'username', new RegExp('^nitthilan$', 'i') );
    query.findOne(function (err, user) {
      console.log(err);
      console.log(user);
    });
  });
});

