var restify = require('restify');
module.exports = function(app,auth,baseUrl, config){
  var article = require(config.root+'./lib/middleware/article.js')(config);
  var log = require(config.root+'./lib/log.js').appLogger;
  var resourceUrl = baseUrl+"/articles";
  log.info(resourceUrl);

  var sendResponse = function(res, next){
    return function(body){
      res.send(body);
      next();
    };
  }

  var getAllUrlConfig = {
    url : resourceUrl+"/:id", 
    validation:{
      id:{
        isRequired:true, 
        isHexadecimal:true, 
        scope:'params'
      }
    }
  }
  var validateGetAll = function(req, res, next){
    if(!req.accepts("application/json")){
      next(new restify.InvalidHeaderError('invalid accpet header'));
    }
    log.info("ID "+ req.params.id);
    article.getAllArticlesFromSub(req.params.id, sendResponse(res, next));
  }
  // getting a single subscription information
  app.get(getAllUrlConfig, /*auth.requiresLogin, */ validateGetAll);
}
