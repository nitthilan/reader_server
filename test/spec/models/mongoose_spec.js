describe('with none of its required fields filled in', function() {
  beforeEach(function(){
    var mongoose = require('mongoose');
    var config = require('../../../lib/config.js');
    var connectStr = config.db_prefix +'://'+config.host+':'+config.db_port+'/'+config.development.db_name;
    Schema = mongoose.Schema;
    ObjectId = Schema.ObjectId;
    console.log(connectStr);
    mongoose.connect(connectStr);
    var db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function callback () {
      console.log("Database connection opened.");
    });
  });
  it('To include a model into', function(){
    var ARTICLE = require('../../../lib/models/article');
    var article = new ARTICLE();
    var num = 0, flag = false;
    article.title = "IBN live";
    article.description = "Live news all the time";
    article.summary = "live news";
    // Validation of save
    runs(function() {
      flag = false;
      num = 0;
      console.log("num init "+num);

      article.save(function(error,article) {
        console.log("error "+error);
        console.log("article "+article);
        console.log("num "+num);
        flag = true;
      });
    });

    waitsFor(function() {
      num++;
      return flag;
    }, "The save to be completed", 500);

    runs(function() {
      expect(num).toEqual(1);
    });
 
  });
});
