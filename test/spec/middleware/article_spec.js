
describe('validating feed parser', function(){
  it('reading a positive url', function(){

    var config = require('../../../lib/config.js')['development'];
    require(config.root + './lib/models/article.js');
    var article = require(config.root + './lib/middleware/article.js');
    article.getAllArticles("http://ibnlive.in.com/ibnrss/rss/business/business.xml");
    console.log("Test run");

  });
});
