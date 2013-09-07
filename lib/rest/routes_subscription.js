var restify = require('restify');
module.exports = function(app, auth, baseUrl, config, log){
  var subscription = require(config.root+'./lib/middleware/subscription.js')(config);
  var log = require(config.root+'./lib/log.js').appLogger;
  var resourceUrl = baseUrl+"/subscriptions";
  log.info(resourceUrl);

  var sendResponse = function(res, next){
    return function(body){
      res.send(body);
      next();
    };
  }

  var validateGet = function(req, res, next){
    if(!req.accepts("application/json")){
      next(new restify.InvalidHeaderError('invalid accpet header'));
    }
    subscription.getSub({},'name subscriptionUrl',sendResponse(res, next));
  }
  var validatePost = function(req, res, next){
    if(!req.accepts("application/json")){
      return next(new restify.InvalidHeaderError('invalid accpet header'));
    }
    if(!req.is("application/json")){
      return next(new restify.InvalidContentError('invalid content type'));
    }
    subscription.addSub(req.params.url, sendResponse(res, next));
  }
  var validateGetId = function(req, res, next){
    if(!req.accepts("application/json")){
      next(new restify.InvalidHeaderError('invalid accpet header'));
    }
    log.info("ID ", req.params.id);
    subscription.getSub({_id:req.params.id},'',sendResponse(res, next));
  }
  var postUrlConfig = {
    url : resourceUrl+"/xmlUrl",
    validation : {
      url:{
        isRequired:true,
        isUrl:true,
        scope:'params'
      }
    }
  }
  var getIdUrlConfig = {
    url : resourceUrl+"/:id", 
    validation:{
      id:{
        isRequired:true, 
        isHexadecimal:true, 
        scope:'params'
      }
    }
  }
  var delIdUrlConfig = {
    url : resourceUrl+"/:id", 
    validation:{
      id:{
        isRequired:true,
        isHexadecimal:true,
        scope:'params'
      }
    }
  }
  // getting the list of all subscriptions
  app.get(resourceUrl, auth.requiresLogin, validateGet);
  // Adding a single subscription
  app.post(postUrlConfig, auth.requiresLogin, validatePost);

  // getting a single subscription information
  app.get(getIdUrlConfig, auth.requiresLogin, validateGetId);
   // getting a single subscription information
  app.del(delIdUrlConfig, auth.requiresLogin, function(req,res,next){
    log.info("ID ", req.params.id);
    subscription.delSub(req.params.id, sendResponse(res, next));
  });
  
  // Importing a list of urls from xml files 
  app.post(resourceUrl+"/xmlUrls", auth.requiresLogin, function(req,res){
    res.send(req.params);
  });
  
  
}
